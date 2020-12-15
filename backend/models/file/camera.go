package file

import (
	"encoding/json"
	"errors"

	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"

	mcommon "gitlab.com/brazncorp/web-ui/models/common"
)

// CameraConfig struct
type CameraConfig struct {
	ID                 int            `json:"id,omitempty"`
	Name               string         `json:"name,omitempty"`
	Stream             string         `json:"stream,omitempty"`
	DetectionMaskImage string         `json:"detection_mask_image,omitempty"`
	GstreamerFormat    string         `json:"gstreamer_format,omitempty"`
	Barrier            *BarrierConfig `json:"barrier,omitempty"`
}

// NewCameraConfig function
func NewCameraConfig() *CameraConfig {
	return nil
}

// SaveDirectory function
func (c *CameraConfig) SaveDirectory(directory string) (err error) {
	config.DefaultConfig.Set(directory, "agent", "camera_dir")
	if err = mcommon.JSON.Write("config.json", config.DefaultConfig); nil != err {
		log.Errorf("[File][Camera] Save directory failed!: msg=[%s], err=[%+v], data=[%s]", err.Error(), err, directory)

		return
	}
	log.Info("[File][Camera] Save directory success")

	return
}

// Save function
func (c *CameraConfig) Save(data interface{}) (err error) {
	p := config.Get("agent", "config_path").String("")
	if "" == p {
		err = errors.New("Agent config not found")
		log.Errorf("[File][Camera] Read failed!: msg=[%s], err=[%+v], data=[%+v]", err.Error(), err, data)

		return
	}

	var cfg config.Config
	var curCfg []map[string]interface{}
	if cfg, err = mcommon.JSON.Read(p, &curCfg, "agent", "cameras"); nil != err {
		return
	}

	var newCfg []map[string]interface{}
	b, _ := json.Marshal(data)
	_ = json.Unmarshal(b, &newCfg)

	for _, nc := range newCfg {
		i := 0
		for ; i < len(curCfg); i++ {
			if nc["id"] == curCfg[i]["id"] {
				break
			}
		}
		if i == len(curCfg) {
			curCfg = append(curCfg, nc)
		}
	}

	for i := 0; i < len(curCfg); i++ {
		j := 0
		for ; j < len(newCfg); j++ {
			if newCfg[j]["id"] == curCfg[i]["id"] {
				for k, v := range newCfg[j] {
					curCfg[i][k] = v
				}
				break
			}
		}
		if j == len(newCfg) {
			lastIndex := len(curCfg) - 1
			curCfg[i] = curCfg[lastIndex]
			curCfg = curCfg[:lastIndex]
		}
	}

	cfg.Set(curCfg, "agent", "cameras")
	if err = mcommon.JSON.Write(p, cfg); nil != err {
		log.Errorf("[File][Camera] Save failed!: msg=[%s], err=[%+v], data=[%+v]", err.Error(), err, curCfg)

		return
	}
	log.Info("[File][Camera] Save success")

	return
}
