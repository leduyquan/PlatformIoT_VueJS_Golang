package file

import (
	"encoding/json"
	"errors"

	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"

	mcommon "gitlab.com/brazncorp/web-ui/models/common"
)

// AgentConfig struct
type AgentConfig struct{}

// NewAgentConfig function
func NewAgentConfig() *AgentConfig {
	return nil
}

// Save function
func (a *AgentConfig) Save(data interface{}) (err error) {
	p := config.Get("agent", "config_path").String("")
	if "" == p {
		err = errors.New("Agent config not found")
		log.Errorf("[File][Agent] Read failed!: msg=[%s], err=[%+v], data=[%+v]", err.Error(), err, data)

		return
	}

	var cfg config.Config
	var curCfg map[string]interface{}
	if cfg, err = mcommon.JSON.Read(p, &curCfg, "agent"); nil != err {
		return
	}

	var newCfg map[string]interface{}
	b, _ := json.Marshal(data)
	_ = json.Unmarshal(b, &newCfg)

	for k, v := range newCfg {
		curCfg[k] = v
	}

	cfg.Set(curCfg, "agent")
	if err = mcommon.JSON.Write(p, cfg); nil != err {
		log.Errorf("[File][Agent] Save failed!: msg=[%s], err=[%+v], data=[%+v]", err.Error(), err, curCfg)

		return
	}
	log.Info("[File][Agent] Save success")

	return
}
