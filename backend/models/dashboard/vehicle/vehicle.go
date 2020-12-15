package vehicle

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	log "github.com/micro/go-micro/v2/logger"

	"gitlab.com/brazncorp/util/config/database"
	"gitlab.com/brazncorp/web-ui/models/common"
	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	mfile "gitlab.com/brazncorp/web-ui/models/file"
)

// Vehicle struct
type Vehicle struct {
}

// Plate struct
type Plate struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	BodyType    string             `json:"body_type,omitempty" bson:"body_type,omitempty"`
	Category    string             `json:"category,omitempty" bson:"category,omitempty"`
	CloudID     string             `json:"cloud_id,omitempty" bson:"cloud_id,omitempty"`
	Color       string             `json:"color,omitempty" bson:"color,omitempty"`
	CountryCode string             `json:"country_code,omitempty" bson:"country_code,omitempty"`
	Make        string             `json:"make,omitempty" bson:"make,omitempty"`
	Model       string             `json:"model,omitempty" bson:"model,omitempty"`
	PlateNumber string             `json:"plate_number,omitempty" bson:"plate_number,omitempty"`
	Region      string             `json:"region,omitempty" bson:"region,omitempty"`
	CreatedAt   common.CustomTime  `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt   common.CustomTime  `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
	// used to transform to ID
	XID *primitive.ObjectID `json:"_id,omitempty" bson:"-"`
}

// Category struct
type Category struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name      string             `json:"name,omitempty" bson:"name,omitempty"`
	Type      string             `json:"type,omitempty" bson:"type,omitempty"`
	Tags      []string           `json:"tags,omitempty" bson:"tags,omitempty"`
	CreatedAt common.CustomTime  `json:"created_at,time,omitempty" bson:"created_at,omitempty"`
	UpdatedAt common.CustomTime  `json:"updated_at,time,omitempty" bson:"updated_at,omitempty"`
	// used to transform to ID
	XID *primitive.ObjectID `json:"_id,omitempty" bson:"-"`
}

// Rule struct
type Rule struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name        string             `json:"rule_name,omitempty" bson:"rule_name,omitempty"`
	ExactMatch  bool               `json:"exact_match,omitempty" bson:"exact_match,omitempty"`
	DigitsMatch int16              `json:"digits_matching,omitempty" bson:"digits_matching,omitempty"`
	Pattern     string             `json:"pattern,omitempty" bson:"pattern,omitempty"`
	CreatedAt   common.CustomTime  `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt   common.CustomTime  `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
	// used to transform to ID
	XID *primitive.ObjectID `json:"_id,omitempty" bson:"-"`
}

// PlateResponse struct
type PlateResponse struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	BodyType    string             `json:"body_type,omitempty" bson:"body_type,omitempty"`
	Category    string             `json:"category,omitempty" bson:"category,omitempty"`
	CloudID     string             `json:"cloud_id,omitempty" bson:"cloud_id,omitempty"`
	Color       string             `json:"color,omitempty" bson:"color,omitempty"`
	CountryCode string             `json:"country_code,omitempty" bson:"country_code,omitempty"`
	Make        string             `json:"make,omitempty" bson:"make,omitempty"`
	Model       string             `json:"model,omitempty" bson:"model,omitempty"`
	PlateNumber string             `json:"plate_number,omitempty" bson:"plate_number,omitempty"`
	Region      string             `json:"region,omitempty" bson:"region,omitempty"`
	CreatedAt   time.Time          `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt   time.Time          `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
	// used to transform to ID
	XID *primitive.ObjectID `json:"_id,omitempty" bson:"-"`
}

// CategoryResponse struct
type CategoryResponse struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name      string             `json:"name,omitempty" bson:"name,omitempty"`
	Type      string             `json:"type,omitempty" bson:"type,omitempty"`
	Tags      []string           `json:"tags,omitempty" bson:"tags,omitempty"`
	CreatedAt time.Time          `json:"created_at,time,omitempty" bson:"created_at,omitempty"`
	UpdatedAt time.Time          `json:"updated_at,time,omitempty" bson:"updated_at,omitempty"`
	// used to transform to ID
	XID *primitive.ObjectID `json:"_id,omitempty" bson:"-"`
}

// RuleResponse struct
type RuleResponse struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name        string             `json:"rule_name,omitempty" bson:"rule_name,omitempty"`
	ExactMatch  bool               `json:"exact_match,omitempty" bson:"exact_match,omitempty"`
	DigitsMatch int16              `json:"digits_matching,omitempty" bson:"digits_matching,omitempty"`
	Pattern     string             `json:"pattern,omitempty" bson:"pattern,omitempty"`
	CreatedAt   time.Time          `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt   time.Time          `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
	// used to transform to ID
	XID *primitive.ObjectID `json:"_id,omitempty" bson:"-"`
}

// ReadPlates function
func (s *Vehicle) ReadPlates() ([]PlateResponse, error) {
	var m []PlateResponse

	if err := database.Connection.Find("vehicle_plates", nil, &m); err != nil {
		log.Errorf("[Vehicle][Plate] Read failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return nil, err
	}

	return m, nil
}

// ReadCategories function
func (s *Vehicle) ReadCategories() ([]CategoryResponse, error) {
	var m []CategoryResponse

	if err := database.Connection.Find("vehicle_categories", nil, &m); err != nil {
		log.Errorf("[Vehicle][Category] Read failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return nil, err
	}

	return m, nil
}

// ReadRules function
func (s *Vehicle) ReadRules() ([]RuleResponse, error) {
	var m []RuleResponse

	if err := database.Connection.Find("vehicle_matching_rules", nil, &m); err != nil {
		log.Errorf("[Vehicle][Rule] Read failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return nil, err
	}

	return m, nil
}

// SyncPlates function
func (s *Vehicle) SyncPlates() ([]Plate, error) {
	var err error
	var m []Plate

	if err = mcommon.Auth.Get("/vehicles/list", &m); err != nil {
		log.Errorf("[Vehicle][Plate] Fetch failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return nil, err
	}

	for i := 0; i < len(m); i++ {
		p := &m[i]
		p.ID = *p.XID
		p.XID = nil
	}

	if _, err = freshCreate("vehicle_plates", m); err != nil {
		log.Errorf("[Vehicle][Plate] Persist failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return nil, err
	}

	var catIDs []string
	for _, e := range m {
		i := 0
		for ; i < len(catIDs); i++ {
			if e.Category == catIDs[i] {
				break
			}
		}
		if i == len(catIDs) {
			catIDs = append(catIDs, e.Category)
		}
	}
	if err = mfile.NewRuleConfig().Save(mfile.CategoryID, catIDs); nil != err {
		return m, err
	}

	log.Debugf("[Vehicle][Plate] Fetch plates done: %+v", m)

	return m, err
}

// SyncCategories function
func (s *Vehicle) SyncCategories() ([]Category, error) {
	var err error
	var m []Category

	if err = mcommon.Auth.Get("/vehicles/categories", &m); err != nil {
		log.Errorf("[Vehicle][Category] Fetch failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return nil, err
	}

	for i := 0; i < len(m); i++ {
		p := &m[i]
		p.ID = *p.XID
		p.XID = nil
	}

	if _, err = freshCreate("vehicle_categories", m); err != nil {
		log.Errorf("[Vehicle][Category] Persist failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return nil, err
	}

	var catIDs []string
	for _, e := range m {
		i := 0
		for ; i < len(catIDs); i++ {
			if e.ID.Hex() == catIDs[i] {
				break
			}
		}
		if i == len(catIDs) {
			catIDs = append(catIDs, e.ID.Hex())
		}
	}
	if err = mfile.NewRuleConfig().Save(mfile.CategoryID, catIDs); nil != err {
		return m, err
	}

	log.Debugf("[Vehicle][Category] Fetch plates done: %+v", m)

	return m, err
}

// SyncRules function
func (s *Vehicle) SyncRules() ([]Rule, error) {
	var err error
	var m []Rule

	if err = mcommon.Auth.Get("/vehicles/matching-rules", &m); err != nil {
		log.Errorf("[Vehicle][Rule] Fetch failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return nil, err
	}

	for i := 0; i < len(m); i++ {
		p := &m[i]
		p.ID = *p.XID
		p.XID = nil
	}

	if _, err = freshCreate("vehicle_matching_rules", m); err != nil {
		log.Errorf("[Vehicle][Rule] Persist failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return nil, err
	}

	var ruleIDs []string
	for _, e := range m {
		i := 0
		for ; i < len(ruleIDs); i++ {
			if e.ID.Hex() == ruleIDs[i] {
				break
			}
		}
		if i == len(ruleIDs) {
			ruleIDs = append(ruleIDs, e.ID.Hex())
		}
	}
	if err = mfile.NewRuleConfig().Save(mfile.RuleID, ruleIDs); nil != err {
		return m, err
	}

	log.Debugf("[Vehicle][Rule] Fetch plates done: %+v", m)

	return m, err
}

// GetFilterData function
func (s *Vehicle) GetFilterData() interface{} {
	data := map[string]interface{}{}
	data["colors"] = getColor()
	data["makeModel"] = getMakeModel()
	data["bodyType"] = getBodyType()
	data["countries"] = getCountries()

	return data
}

func getColor() interface{} {
	var data []struct {
		ID   primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
		Name string             `json:"name" bson:"name"`
		Desc string             `json:"desc" bson:"desc"`
	}
	if err := database.Connection.Find("vehicle_colors", nil, &data); err != nil {
		return nil
	}

	return data
}

func getCountries() interface{} {
	var data []map[string]interface{}
	if err := database.Connection.Find("vehicle_countries", nil, &data); err != nil {
		return nil
	}

	return data
}

func getBodyType() interface{} {
	var data []map[string]interface{}
	if err := database.Connection.Find("vehicle_body_types", nil, &data); err != nil {
		return nil
	}

	return data
}

func getMakeModel() interface{} {
	var data []map[string]interface{}
	aggregation(&data)

	return data
}

func aggregation(models interface{}) {
	lookupStage := bson.D{{"$lookup", bson.D{{"from", "vehicle_maker_models"}, {"localField", "_id"}, {"foreignField", "maker_id"}, {"as", "models"}}}}
	unwindStage := bson.D{{"$unwind", bson.D{{"path", "$models"}, {"preserveNullAndEmptyArrays", false}}}}
	project := bson.D{{"$project", bson.D{{"_id", "$_id._id"}, {"name", "$_id.name"}, {"value", "$_id.value"}, {"models", "$models"}}}}
	group := bson.D{{"$group", bson.D{
		{"_id", bson.D{{"_id", "$_id"}, {"name", "$name"}, {"value", "$name"}}},
		{"models", bson.D{
			{"$push", bson.D{{"name", "$models.desc"}, {"value", bson.D{{"$concat", bson.A{"$name", "_", "$models.name"}}}}}},
		}},
	}}}
	op := func(db *mongo.Database) (interface{}, error) {
		cur, err := db.Collection("vehicle_makers").Aggregate(database.Connection.Context, mongo.Pipeline{lookupStage, unwindStage, group, project})
		if err != nil {
			return nil, err
		}

		return nil, cur.All(database.Connection.Context, models)
	}
	_, _ = database.Connection.Operate(op)

}

func freshCreate(collection string, models interface{}) (*mongo.InsertManyResult, error) {
	op := func(db *mongo.Database) (interface{}, error) {
		return nil, db.Collection(collection).Drop(database.Connection.Context) // TODO: consider other way which is safer
	}
	_, _ = database.Connection.Operate(op)

	return database.Connection.CreateMany(collection, models)
}
