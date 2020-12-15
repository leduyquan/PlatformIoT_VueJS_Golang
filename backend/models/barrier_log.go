package models

import (
	"encoding/json"
	"time"

	"go.mongodb.org/mongo-driver/bson"

	"gitlab.com/brazncorp/util/config/database"
	"gitlab.com/brazncorp/util/pagination"
	"gitlab.com/brazncorp/util/zero"
)

// NewBarrierLog function
func NewBarrierLog() *BarrierLog {
	return nil
}

type BarrierLog struct {
	ID               string    `json:"id,omitempty" bson:"_id,omitempty"`
	Agent            string    `json:"agent" bson:"agent"`
	Barrier          string    `json:"barrier" bson:"barrier"`
	BestConfidence   float64   `json:"best_confidence" bson:"best_confidence"`
	BestPlateNumber  string    `json:"best_plate_number" bson:"best_plate_number"`
	DeviceName       string    `json:"device_name" bson:"device_name"`
	ImageURL         string    `json:"image_url" bson:"image_url"`
	PlateCropJpeg    string    `json:"plate_crop_jpeg" bson:"plate_crop_jpeg"`
	RegionName       string    `json:"region_name" bson:"region_name"`
	Status           string    `json:"status" bson:"status"`
	ThumbnailURL     string    `json:"thumbnail_url" bson:"thumbnail_url"`
	TravelDirection  float64   `json:"travel_direction" bson:"travel_direction"`
	VehicleBodyType  string    `json:"vehicle_body_type" bson:"vehicle_body_type"`
	VehicleColor     string    `json:"vehicle_color" bson:"vehicle_color"`
	VehicleCropJpeg  string    `json:"vehicle_crop_jpeg" bson:"vehicle_crop_jpeg"`
	VehicleMakeModel string    `json:"vehicle_make_model" bson:"vehicle_make_model"`
	CreatedAt        time.Time `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt        time.Time `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
}

type BarrierLogFilter struct {
	BarrierName []string `json:"barrier_name" form:"barrier_name[]"`
	AgentName   []string `json:"agent_name" form:"agent_name[]"`
	Cameras     []int    `json:"cameras" form:"cameras[]"`
	MakeModel   struct {
		Make  []string `json:"make" form:"make"`
		Model []string `json:"model" form:"model"`
	} `json:"make_model" form:"make_model"`
	Body          []string `json:"body" form:"body[]"`
	Color         []string `json:"color" form:"color[]"`
	CountryRegion struct {
		Country []string `json:"country" form:"country"`
		Region  []string `json:"region" form:"region"`
	} `json:"country_region" form:"country_region"`
	Date    []string `json:"date" form:"date[]"`
	Keyword string   `json:"keyword" form:"keyword"`
	Page    int64    `json:"page" form:"page"`
	Size    int64    `json:"size" form:"size"`
}

func (b *BarrierLog) GetLogs(fltr interface{}) (rsp interface{}, err error) {
	logs := []BarrierLog{}
	opt, err := getFilter(fltr)
	if err != nil {
		return
	}
	collection := database.Connection.Database(database.Config.Database).Collection("openalpr_events")
	rsp, err = pagination.New(collection).Limit(opt["size"].(int64)).Page(opt["page"].(int64)).Sort("created_at", -1).Filter(opt["filter"]).Find(&logs)
	if err != nil {
		return
	}

	return
}

func getFilter(fltr interface{}) (map[string]interface{}, error) {
	var model BarrierLogFilter
	var page int64 = 1
	var size int64 = 10
	setElements := bson.D{{"barrier_status", "active"}}
	b, _ := json.Marshal(fltr)
	if err := json.Unmarshal(b, &model); err != nil {
		return nil, err
	}

	if !zero.IsZero(model.Page) {
		page = model.Page
	}

	if !zero.IsZero(model.Size) {
		size = model.Size
	}

	if !zero.IsZero(model.Keyword) {
		setElements = append(setElements, bson.E{Key: "$or", Value: []bson.M{
			{"best_plate_number": bson.D{{"$regex", model.Keyword}, {"$options", "i"}}},
			{"vehicle_make_model": bson.D{{"$regex", model.Keyword}, {"$options", "i"}}},
			{"vehicle_body_type": bson.D{{"$regex", model.Keyword}, {"$options", "i"}}},
			{"vehicle_color": bson.D{{"$regex", model.Keyword}, {"$options", "i"}}},
			{"region_name": bson.D{{"$regex", model.Keyword}, {"$options", "i"}}},
		}})
	}

	if !zero.IsZero(model.MakeModel.Model) || !zero.IsZero(model.MakeModel.Make) {
		setElements = append(setElements, bson.E{Key: "$or", Value: []bson.M{
			{"vehicle_make": bson.D{{"$in", model.MakeModel.Make}}},
			{"vehicle_make_model": bson.D{{"$in", model.MakeModel.Model}}},
		}})
	}

	if !zero.IsZero(model.Color) {
		setElements = append(setElements, bson.E{Key: "vehicle_color", Value: bson.D{
			{"$in", model.Color},
		}})
	}

	if !zero.IsZero(model.BarrierName) {
		setElements = append(setElements, bson.E{Key: "barrier", Value: bson.D{
			{"$in", model.BarrierName},
		}})
	}

	if !zero.IsZero(model.AgentName) {
		setElements = append(setElements, bson.E{Key: "agent", Value: bson.D{
			{"$in", model.AgentName},
		}})
	}

	if !zero.IsZero(model.Cameras) {
		setElements = append(setElements, bson.E{Key: "external_id", Value: bson.D{
			{"$in", model.Cameras},
		}})
	}

	if !zero.IsZero(model.Body) {
		setElements = append(setElements, bson.E{Key: "vehicle_body_type", Value: bson.D{
			{"$in", model.Body},
		}})
	}

	if !zero.IsZero(model.Date) && !zero.IsZero(model.Date[0]) && !zero.IsZero(model.Date[1]) {
		fd, _ := time.Parse(time.RFC3339, model.Date[0])
		td, _ := time.Parse(time.RFC3339, model.Date[1])

		setElements = append(setElements, bson.E{Key: "created_at", Value: bson.D{
			{"$gte", fd},
			{"$lte", td},
		}})
	}

	if !zero.IsZero(model.CountryRegion.Country) || !zero.IsZero(model.CountryRegion.Region) {
		setElements = append(setElements, bson.E{Key: "$or", Value: []bson.M{
			{"country": bson.D{{"$in", model.CountryRegion.Country}}},
			{"best_region": bson.D{{"$in", model.CountryRegion.Region}}},
		}})
	}

	var data = map[string]interface{}{
		"page":   page,
		"size":   size,
		"filter": setElements,
	}

	return data, nil
}
