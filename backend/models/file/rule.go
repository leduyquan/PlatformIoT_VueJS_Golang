package file

import (
	"errors"

	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"

	mcommon "gitlab.com/brazncorp/web-ui/models/common"
)

type idType int8

const (
	// CategoryID indicate the ID is vehicle category ID
	CategoryID idType = iota
	// RuleID indicate the ID is vehicle rule ID
	RuleID
)

// RuleConfig struct
type RuleConfig struct {
	ID          string        `json:"id,omitempty" bson:"_id,omitempty"`
	CategoryID  string        `json:"category_id,omitempty" bson:"category_id,omitempty"`
	Name        string        `json:"name,omitempty" bson:"rule_name,omitempty"`
	ExactMatch  bool          `json:"exact_match,omitempty" bson:"exact_match,omitempty"`
	DigitsMatch int           `json:"digits_match,omitempty" bson:"digits_matching,omitempty"`
	Pattern     string        `json:"pattern,omitempty" bson:"pattern,omitempty"`
	Plates      []PlateConfig `json:"plates" bson:"plates"`
}

// PlateConfig struct
type PlateConfig struct {
	PlateNumber string `json:"license_plate,omitempty" bson:"plate_number,omitempty"`
	Make        string `json:"make,omitempty" bson:"make,omitempty"`
	Model       string `json:"model,omitempty" bson:"model,omitempty"`
}

// NewRuleConfig function
func NewRuleConfig() *RuleConfig {
	return nil
}

// Save function
func (r *RuleConfig) Save(typ idType, ids []string) (err error) {
	p := config.Get("agent", "config_path").String("")
	if "" == p {
		err = errors.New("Agent config not found")
		log.Errorf("[File][Rule] Read failed!: msg=[%s], err=[%+v], data=[%+v]", err.Error(), err, ids)

		return
	}

	var cfg config.Config
	var curCfg []CameraConfig
	if cfg, err = mcommon.JSON.Read(p, &curCfg, "agent", "cameras"); nil != err {
		return
	}

	for i := 0; i < len(curCfg); i++ {
		c := &curCfg[i]
		if nil == c.Barrier || nil == c.Barrier.Rules {
			continue
		}
		for i := 0; i < len(c.Barrier.Rules); i++ {
			r := &c.Barrier.Rules[i]
			j := 0
			for ; j < len(ids); j++ {
				id := ids[j]
				if typ == CategoryID && r.CategoryID == id {
					var v []PlateConfig
					findPlatesByCategoryID(id, &v)
					r.Plates = v
					break
				} else if typ == RuleID && r.ID == id {
					break
				}
			}
			// remove which rule does not match any ID
			if j == len(ids) {
				lastIndex := len(c.Barrier.Rules) - 1
				c.Barrier.Rules[i] = c.Barrier.Rules[lastIndex]
				c.Barrier.Rules = c.Barrier.Rules[:lastIndex]
			}
		}
	}

	cfg.Set(curCfg, "agent", "cameras")
	if err = mcommon.JSON.Write(p, cfg); nil != err {
		log.Errorf("[File][Rule] Save failed!: msg=[%s], err=[%+v], data=[%+v]", err.Error(), err, curCfg)

		return
	}
	log.Info("[File][Rule] Save success")

	return
}
