package module

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"gitlab.com/brazncorp/util/config/database"
)

type System struct {
}

var moduleServices = []map[string]interface{}{
	{
		"name":        "setting",
		"slug":        "settings",
		"description": "Setting Module",
		"type":        "admin",
		"order":       0,
		"parent_slug": "systems",
		"sub": []map[string]interface{}{
			{
				"name":        "agent",
				"slug":        "agents",
				"description": "Agent List",
				"type":        "admin",
				"order":       0,
			},
			{
				"name":        "setting-camera",
				"slug":        "logs",
				"description": "Camera List",
				"type":        "admin",
				"order":       1,
			},
		},
	},
	{
		"name":        "service",
		"slug":        "services",
		"description": "System Service Module",
		"type":        "admin",
		"order":       1,
		"parent_slug": "systems",
	},
	{
		"name":        "audit",
		"slug":        "audits",
		"description": "System Audit Trail Module",
		"type":        "admin",
		"order":       2,
		"parent_slug": "systems",
	},
}

func (c *System) Run() error {
	groupModule := map[string]interface{}{}
	filterGroup := bson.D{{"name", "system"}, {"type", "admin"}}
	database.Connection.FindOne("modules", filterGroup, &groupModule)

	for _, module := range moduleServices {
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
		if subMod, ok := module["sub"]; ok {
			for _, module := range subMod.([]map[string]interface{}) {
				fltr := bson.D{{"name", module["name"]}, {"type", module["type"]}}
				module["parent_id"] = parent["_id"].(primitive.ObjectID).Hex()
				module["parent_slug"] = parent["slug"]
				module["icon_url"] = nil
				module["default"] = false
				module["status"] = "Active"

				database.Connection.Upsert("modules", fltr, module)
				c.runPermission(module)
			}
		} else {
			c.runPermission(parent)
		}
	}

	return nil
}

func (c *System) runPermission(module map[string]interface{}) {
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
