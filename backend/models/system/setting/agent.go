package setting

import (
	"errors"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"
	"github.com/mitchellh/mapstructure"

	"gitlab.com/brazncorp/util/config/database"
	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	mfile "gitlab.com/brazncorp/web-ui/models/file"
)

// SettingAgent struct
type SettingAgent struct{}

// AgentRequest struct
type AgentRequest struct {
	Name          string `json:"name,omitempty"`
	ServerAddress string `json:"server_address,omitempty"`
}

// AgentResponse struct
type AgentResponse struct {
	Agent `mapstructure:",squash"`
}

// Agent struct
type Agent struct {
	ID            primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty" mapstructure:"_id,omitempty"`
	Name          string             `json:"name,omitempty" bson:"name,omitempty" mapstructure:"name,omitempty"`
	ServerAddress string             `json:"server_address,omitempty" bson:"server_address,omitempty" mapstructure:"server_address,omitempty"`
	Cameras       []Camera           `json:"cameras,omitempty" bson:"cameras,omitempty" mapstructure:"cameras,omitempty"`
}

// Read function
func (s *SettingAgent) Read() (rsp *AgentResponse, err error) {
	var m = new(Agent)
	if err = m.FindOne(); nil != err {
		return
	}

	err = mapstructure.Decode(m, &rsp)

	return
}

// Save function
func (s *SettingAgent) Save(req AgentRequest) (err error) {
	var m = new(Agent)
	if err = m.FindOne(); nil != err {
		return
	}
	_ = mapstructure.Decode(req, m)

	if err = mfile.NewAgentConfig().Save(req); nil != err {
		return
	}

	_ = m.Save()

	return
}

// FindOne function
func (a *Agent) FindOne() (err error) {
	var p string
	if p = config.Get("agent", "config_path").String(""); "" == p {
		err = errors.New("Agent config not found")
		log.Errorf("[Setting][Agent] Read config failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return
	}

	if _, err = mcommon.JSON.Read(p, a, "agent"); nil != err {
		log.Errorf("[Setting][Agent] Read config failed!: msg=[%s], err=[%+v], data=[%s]", err.Error(), err, p)

		return
	}
	log.Debugf("[Setting][Agent] Read config: %+v", *a)

	return
}

// Save function
func (a *Agent) Save() (err error) {
	var m Agent
	if err = database.Connection.FindOne("agents", nil, &m); nil != err {
		log.Errorf("[Setting][Agent] Read failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return
	}
	log.Debugf("[Setting][Agent] Read agent info: %+v", m)

	a.ID = m.ID
	if err = database.Connection.Upsert("agents", nil, a); nil != err {
		log.Errorf("[Setting][Agent] Update failed!: msg=[%s], err=[%+v], model=[%s]", err.Error(), err, *a)

		return
	}
	log.Debugf("[Setting][Agent] Save agent info: %+v", *a)

	return
}
