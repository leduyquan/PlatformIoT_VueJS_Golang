package module

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"gitlab.com/brazncorp/util/config/database"
)

type Configuration struct {
}

var moduleConfigurations = []map[string]interface{}{
	{
		"name":        "configuration-module",
		"slug":        "modules",
		"description": "Modules List",
		"type":        "admin",
		"order":       0,
		"parent_slug": "configurations",
	},
}

func (c *Configuration) Run() error {
	groupModule := map[string]interface{}{}
	filterGroup := bson.D{{"name", "configuration"}, {"type", "admin"}}
	database.Connection.FindOne("modules", filterGroup, &groupModule)

	for _, module := range moduleConfigurations {
		fltr := bson.D{{"name", module["name"]}, {"type", module["type"]}}
		module["parent_id"] = groupModule["_id"].(primitive.ObjectID).Hex()
		module["icon_url"] = nil
		module["default"] = false
		module["status"] = "Active"
		database.Connection.Upsert("modules", fltr, module)
		c.runPermission(module)
	}

	return nil
}

func (c *Configuration) runPermission(module map[string]interface{}) {
	for _, f := range Function {
		fltr := bson.D{{"name", module["name"].(string) + "_" + module["type"].(string) + "_" + f}}
		data := map[string]interface{}{
			"module_id": module["_id"].(primitive.ObjectID).Hex(),
			"name":      module["name"].(string) + "_" + module["type"].(string) + "_" + f,
			"display":   f,
			"function":  f,
			"status":    "Active",
		}
		database.Connection.Upsert("permissions", fltr, data)
	}
}
