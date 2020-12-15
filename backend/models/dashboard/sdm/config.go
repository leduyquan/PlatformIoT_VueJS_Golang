package sdm

import (
	"fmt"

	"github.com/micro/go-micro/v2/config"

	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	"gitlab.com/brazncorp/web-ui/services/file/ini"
)

// Config struct
type Config struct {
	Cameras  []Camera  `json:"cameras"`
	Services []Service `json:"services"`
}

// Camera struct
type Camera struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Ordinal uint8  `json:"ordinal"`
}

// Service struct
type Service struct {
	Active  bool   `json:"active"`
	Icon    string `json:"icon"`
	Name    string `json:"name"`
	Ordinal uint8  `json:"ordinal"`
}

// SetCamera function
func (c *Config) SetCamera(cc CameraConfig) (cam Camera) {
	for _, c := range c.Cameras {
		if c.ID == cc.Camera.ID {
			return
		}
	}

	cam = Camera{
		ID:      cc.Camera.ID,
		Name:    cc.Camera.ID,
		Ordinal: uint8(len(c.Cameras)),
	}

	c.Cameras = append(c.Cameras, cam)

	return
}

// Read function
func (c *Config) Read() (err error) {
	var acc []CameraConfig

	fini := ini.New()
	camDir := config.Get("sdm", "config_dir").String("")
	if err = fini.Fetch(camDir, &acc); err != nil {
		return
	}

	c.Services = []Service{
		Service{
			Name:    "broker",
			Icon:    "icon/broker.svg",
			Ordinal: 0,
		},
		Service{
			Name:    "client",
			Icon:    "icon/client.svg",
			Ordinal: 1,
		},
	}

	for i := 0; i < len(acc); i++ {
		cc := acc[i]
		if cam := c.SetCamera(cc); cam.ID != "" {
			c.Services = append(c.Services, Service{
				Name:    fmt.Sprintf("detection_%d", len(c.Cameras)-1),
				Icon:    "icon/detection.svg",
				Ordinal: uint8(len(c.Services)),
			})
		}
	}

	return
}

// CheckServices function
func (c *Config) CheckServices() (err error) {
	var errMsgs []string

	var mapSrvs map[string]map[string]string
	config.Get("sdm", "services").Scan(&mapSrvs)

	for i := 0; i < len(c.Services); i++ {
		srv := &c.Services[i]
		args, ok := mapSrvs[srv.Name]
		if !ok {
			continue
		}
		if srv.Active, err = mcommon.Cmd.Exec("status", args); err != nil {
			errMsgs = append(errMsgs, fmt.Sprintf("checking service '%s' error '%s'", srv.Name, err.Error()))

			continue
		}
	}

	if len(errMsgs) > 0 {
		err = fmt.Errorf("%v", errMsgs)
	}

	return
}
