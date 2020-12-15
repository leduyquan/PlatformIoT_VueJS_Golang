package module

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"gitlab.com/brazncorp/util/config/database"
)

type Barrier struct {
}

var Function = []string{"view", "create", "update", "delete"}

var module = map[string]interface{}{
	"name":        "barrier",
	"slug":        "barriers",
	"description": "Barrier Management Module",
	"type":        "admin",
	"order":       0,
	"parent_slug": "dashboards",
	"sub": []map[string]interface{}{
		{
			"name":        "barrier-realtime",
			"slug":        "realtime",
			"description": "Barrier Realtime",
			"type":        "dashboard",
			"order":       0,
		},
		{
			"name":        "barrier-logs",
			"slug":        "logs",
			"description": "Barrier Logs",
			"type":        "dashboard",
			"order":       0,
		},
	},
}

func (c *Barrier) Run() error {
	groupModule := map[string]interface{}{}
	filterGroup := bson.D{{"name", "dashboard"}, {"type", "admin"}}
	database.Connection.FindOne("modules", filterGroup, &groupModule)

	fltr := bson.D{{"name", module["name"]}, {"type", module["type"]}}
	parent := map[string]interface{}{
		"name":        module["name"],
		"slug":        module["slug"],
		"parent_slug": module["parent_slug"],
		"description": module["description"],
		"type":        module["type"],
		"parent_id":   groupModule["_id"].(primitive.ObjectID).Hex(),
		"order":       module["order"],
		"icon_url":    nil,
		"default":     false,
		"status":      "Active",
	}
	database.Connection.Upsert("modules", fltr, &parent)

	for _, module := range module["sub"].([]map[string]interface{}) {
		fltr := bson.D{{"name", module["name"]}, {"type", module["type"]}}
		module["parent_id"] = parent["_id"].(primitive.ObjectID).Hex()
		module["parent_slug"] = parent["slug"]
		module["icon_url"] = nil
		module["default"] = false
		module["status"] = "Active"

		database.Connection.Upsert("modules", fltr, module)
		c.runPermission(module)
	}

	return nil
}

func (c *Barrier) runPermission(module map[string]interface{}) {
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
