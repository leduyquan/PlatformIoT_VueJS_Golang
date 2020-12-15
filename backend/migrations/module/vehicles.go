package module

import (
	"encoding/json"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	log "github.com/micro/go-micro/v2/logger"

	"gitlab.com/brazncorp/util/config/database"
)

// Vehicle struct
type Vehicle struct {
}

var modVehicle = map[string]interface{}{
	"name":        "vehicle",
	"slug":        "vehicles",
	"description": "Vehicle Management Module",
	"type":        "admin",
	"order":       0,
	"parent_slug": "dashboards",
	"sub": []map[string]interface{}{
		{
			"name":        "vehicle-list",
			"slug":        "list",
			"description": "'Vehicles List",
			"type":        "admin",
			"order":       0,
		},
		{
			"name":        "vehicle-categories",
			"slug":        "categories",
			"description": "Vehicles categories",
			"type":        "admin",
			"order":       1,
		},
		{
			"name":        "vehicle-matching-rule",
			"slug":        "matching-rules",
			"description": "Matching Rule Detected",
			"type":        "admin",
			"order":       2,
		},
		{
			"name":        "vehicle-realtime",
			"slug":        "realtime",
			"description": "Vehicle Realtime",
			"type":        "dashboard",
			"order":       0,
		},
		{
			"name":        "vehicle-detected",
			"slug":        "detected",
			"description": "Vehicle Detected",
			"type":        "dashboard",
			"order":       1,
		},
	},
}

// Run function
func (c *Vehicle) Run() error {
	groupModule := map[string]interface{}{}
	filterGroup := bson.D{{"name", "dashboard"}, {"type", "admin"}}
	database.Connection.FindOne("modules", filterGroup, &groupModule)

	fltr := bson.D{{"name", modVehicle["name"]}, {"type", modVehicle["type"]}}
	parent := map[string]interface{}{
		"name":        modVehicle["name"],
		"slug":        modVehicle["slug"],
		"parent_slug": modVehicle["parent_slug"],
		"description": modVehicle["description"],
		"type":        modVehicle["type"],
		"parent_id":   groupModule["_id"].(primitive.ObjectID).Hex(),
		"order":       modVehicle["order"],
		"icon_url":    nil,
		"default":     false,
		"status":      "Active",
	}

	database.Connection.Upsert("modules", fltr, &parent)
	for _, module := range modVehicle["sub"].([]map[string]interface{}) {
		fltr := bson.D{{"name", module["name"]}, {"type", module["type"]}}
		module["parent_id"] = parent["_id"].(primitive.ObjectID).Hex()
		module["parent_slug"] = parent["slug"]
		module["icon_url"] = nil
		module["default"] = false
		module["status"] = "Active"
		database.Connection.Upsert("modules", fltr, module)
		c.runPermission(module)
	}

	createColors()
	createCountries()
	createBodyTyped()
	createMakersAndModels()

	return nil
}

func (c *Vehicle) runPermission(module map[string]interface{}) {
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

func createColors() {
	type Data struct {
		Name string
		Desc string
	}
	colors := []string{"black", "blue", "brown", "gold-beige", "green", "orange", "pink", "purple", "red", "silver-gray", "white", "yellow"}
	insertData := make([]Data, len(colors))
	for i, color := range colors {
		insertData[i].Name = color
		insertData[i].Desc = strings.ToLower(color)
	}
	op := func(db *mongo.Database) (interface{}, error) {
		col := db.Collection("vehicle_colors")
		return nil, col.Drop(database.Connection.Context)
	}
	_, _ = database.Connection.Operate(op)
	database.Connection.CreateMany("vehicle_colors", insertData)
}

func createCountries() {
	var cfg map[string]interface{}
	err := json.Unmarshal([]byte(DumpCountries), &cfg)
	if nil != err {
		log.Errorf("Open config file failed: msg=[%s] err:=[%+v]", err.Error(), err)
		return
	}
	op := func(db *mongo.Database) (interface{}, error) {
		col := db.Collection("vehicle_countries")
		return nil, col.Drop(database.Connection.Context)
	}
	_, _ = database.Connection.Operate(op)
	database.Connection.Create("vehicle_countries", cfg)
}

func createBodyTyped() {
	var items []map[string]interface{}
	err := json.Unmarshal([]byte(DumpBodyTypes), &items)
	if nil != err {
		log.Errorf("Open config file failed: msg=[%s] err:=[%+v]", err.Error(), err)
		return
	}
	op := func(db *mongo.Database) (interface{}, error) {
		col := db.Collection("vehicle_body_types")
		return nil, col.Drop(database.Connection.Context)
	}
	_, _ = database.Connection.Operate(op)
	database.Connection.CreateMany("vehicle_body_types", items)
}

func createMakersAndModels() {
	var items []map[string]interface{}
	err := json.Unmarshal([]byte(DumpModels), &items)
	if nil != err {
		log.Errorf("Open config file failed: msg=[%s] err:=[%+v]", err.Error(), err)
		return
	}
	for _, item := range items {
		fltr := bson.D{
			{"name", item["name"]},
		}
		make := map[string]interface{}{
			"name": item["name"],
			"desc": item["desc"],
		}
		database.Connection.Upsert("vehicle_makers", fltr, &make)
		if len(item["models"].([]interface{})) > 0 {
			for _, model := range item["models"].([]interface{}) {
				fltr := bson.D{
					{"maker_id", make["_id"].(primitive.ObjectID).Hex()},
					{"name", model},
				}
				model := map[string]interface{}{
					"maker_id": make["_id"],
					"name":     model,
					"desc":     model,
				}
				database.Connection.Upsert("vehicle_maker_models", fltr, &model)
			}
		}
	}
}
