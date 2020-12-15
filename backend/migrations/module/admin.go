package module

import (
	"go.mongodb.org/mongo-driver/bson"

	"gitlab.com/brazncorp/util/config/database"
)

type Admin struct {
}

var modulesAdmin = []map[string]interface{}{
	{
		"name":        "dashboard",
		"slug":        "dashboards",
		"description": "Dashboard Setup",
		"type":        "admin",
		"parent_id":   nil,
		"parent_slug": nil,
		"order":       2,
		"icon_url":    "dashboard_setup",
	},
	{
		"name":        "account",
		"slug":        "accounts",
		"description": "User Accounts",
		"type":        "admin",
		"parent_id":   nil,
		"parent_slug": nil,
		"order":       6,
		"icon_url":    "people",
	},
	{
		"name":        "system",
		"slug":        "systems",
		"description": "System",
		"type":        "admin",
		"parent_id":   nil,
		"parent_slug": nil,
		"order":       8,
		"icon_url":    "system",
	},
	{
		"name":        "configuration",
		"slug":        "configurations",
		"description": "Configurations",
		"type":        "admin",
		"parent_id":   nil,
		"parent_slug": nil,
		"order":       9,
		"icon_url":    "setting",
	},
}

func (c *Admin) Run() error {

	for _, module := range modulesAdmin {
		fltr := bson.D{{"name", module["name"]}, {"type", module["type"]}, {"parent_slug", nil}}
		module["default"] = false
		module["status"] = "Active"
		database.Connection.Upsert("modules", fltr, module)
	}

	return nil
}
