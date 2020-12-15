package models

import (
	"time"

	"github.com/micro/go-micro/v2/logger"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"gitlab.com/brazncorp/util/config/database"
)

type Module struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name        string             `json:"name,omitempty" bson:"name,omitempty"`
	Description string             `json:"description,omitempty" bson:"description,omitempty"`
	Type        string             `json:"type" bson:"type"`
	Default     bool               `json:"default" bson:"default"`
	IconURL     interface{}        `json:"icon_url" bson:"icon_url"`
	Order       int                `json:"order" bson:"icon_url"`
	ParentID    string             `json:"parent_id" bson:"parent_id"`
	ParentSlug  string             `json:"parent_slug" bson:"parent_slug"`
	Slug        string             `json:"slug" bson:"slug"`
	Status      string             `json:"status,omitempty" bson:"status,omitempty"`
	UpdatedAt   time.Time          `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
	CreatedAt   time.Time          `json:"created_at,omitempty" bson:"created_at,omitempty"`
}

func (m *Module) GetModules(models interface{}) {
	match := bson.D{{"$match", bson.D{{"parent_slug", nil}}}}
	graphLookup := bson.D{
		{"$graphLookup", bson.D{
			{"from", "modules"},
			{"startWith", "$slug"},
			{"connectFromField", "slug"},
			{"connectToField", "parent_slug"},
			{"as", "children"},
			{"maxDepth", 0}}}}
	unwindStage := bson.D{{"$unwind", "$children"}}
	graphLookupLevel := bson.D{
		{"$graphLookup", bson.D{
			{"from", "modules"},
			{"startWith", "$children.slug"},
			{"connectFromField", "children.slug"},
			{"connectToField", "parent_slug"},
			{"as", "children.children"},
			{"maxDepth", 0}}}}
	group := bson.D{{"$group", bson.D{
		{"_id", "$_id"},
		{"name", bson.M{"$first": "$name"}},
		{"description", bson.M{"$first": "$description"}},
		{"slug", bson.M{"$first": "$slug"}},
		{"parent_slug", bson.M{"$first": "$parent_slug"}},
		{"children", bson.M{"$push": "$children"}},
	}}}
	op := func(db *mongo.Database) (interface{}, error) {
		cur, err := db.Collection("modules").Aggregate(database.Connection.Context, mongo.Pipeline{match, graphLookup, unwindStage, graphLookupLevel, group})
		if err != nil {
			logger.Info(err)
			return nil, err
		}

		return nil, cur.All(database.Connection.Context, models)
	}
	var err error
	_, err = database.Connection.Operate(op)
	if err != nil {
		logger.Error(err)
	}
}
