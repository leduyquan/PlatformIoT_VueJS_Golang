package account

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"gitlab.com/brazncorp/util/config/database"
)

var modules = []map[string]interface{}{
	{
		"name":        "user",
		"slug":        "users",
		"description": "Account User Module",
		"type":        "admin",
		"order":       0,
		"parent_slug": "accounts",
	},
	{
		"name":        "role",
		"slug":        "roles",
		"description": "Account Role Module",
		"type":        "admin",
		"order":       1,
		"parent_slug": "accounts",
	},
}

var function = []string{"view", "create", "update", "delete"}

func (c *User) RunModule() {
	groupModule := map[string]interface{}{}
	filterGroup := bson.D{{"name", "account"}, {"type", "admin"}}
	database.Connection.FindOne("modules", filterGroup, &groupModule)

	for _, module := range modules {
		fltr := bson.D{{"name", module["name"]}, {"type", module["type"]}}
		module["parent_id"] = groupModule["_id"].(primitive.ObjectID).Hex()
		module["icon_url"] = nil
		module["default"] = false
		module["status"] = "Active"
		database.Connection.Upsert("modules", fltr, module)
		runPermission(module)
	}
}

func runPermission(module map[string]interface{}) {
	for _, f := range function {
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
