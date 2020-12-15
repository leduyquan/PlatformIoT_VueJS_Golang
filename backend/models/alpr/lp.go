package alpr

import (
	"encoding/json"
	"image"
	"path/filepath"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"

	"gitlab.com/brazncorp/util/config/database"
	"gitlab.com/brazncorp/util/pagination"
	"gitlab.com/brazncorp/util/zero"
	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	"gitlab.com/brazncorp/web-ui/stream"
)

var table = "alpr_data"

// DataHook struct
type DataHook struct {
	Data struct {
		CameraID       string `json:"camera_id"`
		Filename       string `json:"filename"`
		Timestamp      string `json:"timestamp"`
		TimestampLocal string `json:"timestamp_local"`
		Results        []struct {
			Box     Box     `json:"box"`
			Plate   string  `json:"plate"`
			Score   float64 `json:"score"`
			Dscore  float64 `json:"dscore"`
			Region  Region  `json:"region"`
			Vehicle Vehicle `json:"vehicle"`
		} `json:"results"`
	} `json:"data"`
}

// LP struct
type LP struct {
	ID             primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	CameraID       interface{}        `json:"camera_id" bson:"camera_id,omitempty"`
	Filename       string             `json:"filename"  bson:"filename"`
	CropImage      string             `json:"crop_image" bson:"crop_image"`
	Timestamp      string             `json:"timestamp" bson:"timestamp"`
	TimestampLocal string             `json:"timestamp_local" bson:"timestamp_local"`

	Box     Box     `json:"box"`
	Plate   string  `json:"plate"`
	Score   float64 `json:"score"`
	Dscore  float64 `json:"dscore"`
	Region  Region  `json:"region"`
	Vehicle Vehicle `json:"vehicle"`

	CreatedAt time.Time `json:"created_at,omitempty" bson:"created_at,omitempty"`
}

// LpFilter struct
type LpFilter struct {
	Page int64 `json:"page" form:"page"`
	Size int64 `json:"size" form:"size"`
}

// Box struct
type Box struct {
	Xmin int `json:"xmin"`
	Ymin int `json:"ymin"`
	Ymax int `json:"ymax"`
	Xmax int `json:"xmax"`
}

// Region struct
type Region struct {
	Code  string  `json:"code"`
	Score float64 `json:"score"`
}

// Vehicle struct
type Vehicle struct {
	Score float64 `json:"score"`
	Type  string  `json:"type"`
	Box   Box     `json:"box"`
}

// Get function
func Get(fltr LpFilter) (rsp interface{}, err error) {
	data := []LP{}
	opt, err := getFilter(fltr)
	if err != nil {
		return
	}
	collection := database.Connection.Database(database.Config.Database).Collection(table)
	rsp, err = pagination.New(collection).Limit(opt["size"].(int64)).Page(opt["page"].(int64)).Sort("created_at", -1).Filter(opt["filter"]).Find(&data)
	if err != nil {
		return
	}

	return
}

// Create function
func Create(data []LP) error {
	_, err := database.Connection.CreateMany(table, data)

	return err
}

// StreamData function
func StreamData(s *stream.Streamer, data []LP) {
	for _, lp := range data {
		go func(lp LP) {
			b, _ := json.Marshal(lp)
			s.Notifier <- b
		}(lp)
	}
}

// ProcessData function
func (dh DataHook) ProcessData() (results []LP, err error) {
	var imgPath = ""
	p := filepath.Join(config.Get("alpr", "config_dir").String(""), dh.Data.Filename)
	var img image.Image
	if img, err = mcommon.Img.Get(p); err != nil {
		log.Errorf("%s, path=[%s], data=[%+v]", err.Error(), p, dh.Data)
	} else {
		path := filepath.Join("public", "lp", dh.Data.Filename)
		imgPath = filepath.Join("file", "lp", dh.Data.Filename)
		if err = mcommon.Img.Save(img, path); err != nil {
			log.Error(err)
			imgPath = ""
		}
	}

	dir, file := filepath.Split(dh.Data.Filename)

	for key, lp := range dh.Data.Results {
		var m LP
		m.Filename = imgPath
		m.CameraID = dh.Data.CameraID
		m.Timestamp = dh.Data.Timestamp
		m.TimestampLocal = dh.Data.TimestampLocal
		m.Box = lp.Box
		m.Dscore = lp.Dscore
		m.Plate = lp.Plate
		m.Score = lp.Score
		m.Region = lp.Region
		m.Vehicle = lp.Vehicle
		m.CreatedAt = time.Now()

		if img != nil {
			pCrop := filepath.Join("public", "lp", dir, "crop_"+strconv.Itoa(key)+file)
			xmin := lp.Box.Xmin + lp.Vehicle.Box.Xmin
			ymin := lp.Box.Ymin + lp.Vehicle.Box.Ymin
			width := (lp.Box.Xmax - lp.Box.Xmin) + xmin
			height := (lp.Box.Ymax - lp.Box.Ymin) + ymin
			cropped := mcommon.Img.Crop(img, width, height, xmin, ymin)
			err = mcommon.Img.Save(cropped, pCrop)
			if err != nil {
				log.Error(err)
			} else {
				m.CropImage = filepath.Join("file", "lp", dir, "crop_"+strconv.Itoa(key)+file)
			}
		}
		results = append(results, m)
	}

	return
}

// GetFilter function
func getFilter(fltr LpFilter) (map[string]interface{}, error) {
	var page int64 = 1
	var size int64 = 10

	setElements := bson.D{}

	if !zero.IsZero(fltr.Page) {
		page = fltr.Page
	}

	if !zero.IsZero(fltr.Size) {
		size = fltr.Size
	}

	var data = map[string]interface{}{
		"page":   page,
		"size":   size,
		"filter": setElements,
	}

	return data, nil
}
