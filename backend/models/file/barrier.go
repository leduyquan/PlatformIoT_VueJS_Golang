package file

import (
	"encoding/json"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"

	"gitlab.com/brazncorp/util/config/database"
	mcommon "gitlab.com/brazncorp/web-ui/models/common"
)

// Barrier struct
type Barrier struct {
	ID       primitive.ObjectID `json:"id"`
	CameraID int                `json:"camera_id"`
	Active   bool               `json:"active"`
	Name     string             `json:"name"`
	Host     string             `json:"host"`
	Port     int                `json:"port"`
	URL      string             `json:"url"`
	Rules    []struct {
		CategoryID string `json:"category_id"`
		RuleID     string `json:"rule_id"`
	} `json:"rules"`
}

// BarrierConfig struct
type BarrierConfig struct {
	ID     string       `json:"id,omitempty"`
	Active bool         `json:"active,omitempty"`
	Name   string       `json:"name,omitempty"`
	Host   string       `json:"host,omitempty"`
	Port   int          `json:"port,omitempty"`
	URL    string       `json:"url,omitempty"`
	Rules  []RuleConfig `json:"rules"`
}

// NewBarrierConfig function
func NewBarrierConfig() *BarrierConfig {
	return nil
}

// Save function
func (bc *BarrierConfig) Save(data interface{}) (err error) {
	p := config.Get("agent", "config_path").String("")
	if "" == p {
		err = errors.New("Agent config not found")
		log.Errorf("[File][Barrier] Read failed!: msg=[%s], err=[%+v] data=[%+v]", err.Error(), err, data)

		return
	}

	var cfg config.Config
	var curCfg []CameraConfig
	if cfg, err = mcommon.JSON.Read(p, &curCfg, "agent", "cameras"); nil != err {
		return
	}

	var newCfg Barrier
	b, _ := json.Marshal(data)
	_ = json.Unmarshal(b, &newCfg)

	var camCfg *CameraConfig
	for i := 0; i < len(curCfg); i++ {
		if newCfg.CameraID == curCfg[i].ID {
			camCfg = &curCfg[i]
		}
	}
	if nil == camCfg {
		log.Info("[File][Barrier] Camera not found!")

		return
	}

	_ = json.Unmarshal(b, &camCfg.Barrier)
	camCfg.Barrier.Rules = make([]RuleConfig, len(newCfg.Rules))
	for i := 0; i < len(newCfg.Rules); i++ {
		r := newCfg.Rules[i]
		if err = findByID("vehicle_matching_rules", r.RuleID, &camCfg.Barrier.Rules[i]); nil != err {
			log.Errorf("[File][Barrier] Find rule failed!: msg=[%s], err=[%+v], data=[%s]", err.Error(), err, r.RuleID)

			return
		}
		if err = findPlatesByCategoryID(r.CategoryID, &camCfg.Barrier.Rules[i].Plates); nil != err {
			log.Errorf("[File][Barrier] Find category failed!: msg=[%s], err=[%+v], data=[%s]", err.Error(), err, r.CategoryID)

			return
		}
		camCfg.Barrier.Rules[i].CategoryID = r.CategoryID
	}

	cfg.Set(curCfg, "agent", "cameras")
	if err = mcommon.JSON.Write(p, cfg); nil != err {
		log.Errorf("[File][Barrier] Save failed!: msg=[%s], err=[%+v], data=[%+v]", err.Error(), err, curCfg)

		return
	}
	log.Info("[File][Barrier] Save success")

	return
}

// Delete function
func (bc *BarrierConfig) Delete(id string) (err error) {
	p := config.Get("agent", "config_path").String("")
	if "" == p {
		err = errors.New("Agent config not found")
		log.Errorf("[File][Barrier] Read failed!: msg=[%s], err=[%+v] data=[%s]", err.Error(), err, id)

		return
	}

	var cfg config.Config
	var curCfg []CameraConfig
	if cfg, err = mcommon.JSON.Read(p, &curCfg, "agent", "cameras"); nil != err {
		return
	}

	var camCfg *CameraConfig
	for i := 0; i < len(curCfg); i++ {
		if nil != curCfg[i].Barrier && id == curCfg[i].Barrier.ID {
			camCfg = &curCfg[i]
		}
	}
	if nil == camCfg {
		log.Info("[File][Barrier] Camera not found!")

		return
	}

	camCfg.Barrier = nil

	cfg.Set(curCfg, "agent", "cameras")
	if err = mcommon.JSON.Write(p, cfg); nil != err {
		log.Errorf("[File][Barrier] Save failed!: msg=[%s], err=[%+v], data=[%+v]", err.Error(), err, curCfg)

		return
	}
	log.Info("[File][Barrier] Save success")

	return
}

func findPlatesByCategoryID(categoryID string, data interface{}) (err error) {
	fltr := bson.D{{"category", categoryID}}
	err = database.Connection.Find("vehicle_plates", fltr, data)

	return
}

func findByID(collection string, id string, data interface{}) (err error) {
	var objID primitive.ObjectID
	if objID, err = primitive.ObjectIDFromHex(id); nil != err {
		return
	}

	fltr := bson.D{{"_id", objID}}
	err = database.Connection.FindOne(collection, fltr, data)

	return
}
