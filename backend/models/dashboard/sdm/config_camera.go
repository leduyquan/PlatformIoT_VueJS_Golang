package sdm

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"path"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/micro/go-micro/v2/broker"
	"github.com/micro/go-micro/v2/broker/nats"
	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"
	"github.com/micro/go-plugins/broker/kafka/v2"

	"gitlab.com/brazncorp/web-ui/services/file/ini"
	"gitlab.com/brazncorp/web-ui/stream"
)

// CameraConfig struct
type CameraConfig struct {
	App struct {
		MinDistance string `json:"min_distance" ini:"min_distance"`
		DwellTime   string `json:"dwell_time" ini:"dwell_time"`
	} `json:"app" ini:"app"`
	Camera struct {
		ID        string `json:"id" ini:"id"`
		Direction string `json:"direction" ini:"direction"`
		URL       string `json:"url" ini:"url"`
	} `json:"camera" ini:"camera"`
	Detection struct {
		UseGPU        string `json:"use_gpu" ini:"use_gpu"`
		Network       string `json:"network" ini:"network"`
		MinConf       string `json:"min_conf" ini:"min_conf"`
		NmsThresh     string `json:"nms_thresh" ini:"nms_thresh"`
		FrameMaxWidth string `json:"frame_max_width" ini:"frame_max_width"`
		LatestFrame   string `json:"latest_frame" ini:"latest_frame"`
	} `json:"detection" ini:"detection"`
	Tracking struct {
		IsTracking     string `json:"is_tracking" ini:"is_tracking"`
		MaxDisappeared string `json:"max_disappeared" ini:"max_disappeared"`
		MaxDistance    string `json:"max_distance" ini:"max_distance"`
		SkipFrames     string `json:"skip_frames" ini:"skip_frames"`
	} `json:"tracking" ini:"tracking"`
	Output struct {
		DisplayWidth string `json:"display_width" ini:"display_width"`
		IsDisplayRoi string `json:"is_display_roi" ini:"is_display_roi"`
	} `json:"output" ini:"output"`
	Broker struct {
		Name      string `json:"name" ini:"name"`
		Address   string `json:"address" ini:"address"`
		Topic     string `json:"topic" ini:"topic"`
		MsgHeader string `json:"msg_header" ini:"msg_header"`
	} `json:"broker" ini:"broker"`
	Log struct {
		LogLevel string `json:"log_level" ini:"log_level"`
	} `json:"log" ini:"log"`
}

// CameraFrame struct
type CameraFrame struct {
	CameraID string `json:"camera_id"`
	Frame    string `json:"frame"`
}

// Stream function
func (cc *CameraConfig) Stream(id string, c *gin.Context) (err error) {
	var p string
	var am map[string]CameraConfig

	fini := ini.New()
	camDir := config.Get("sdm", "config_dir").String("")
	if err = fini.Fetch(camDir, &am); err != nil {
		return
	}
	for p, *cc = range am {
		if strings.HasSuffix(p, id+".ini") || cc.Camera.ID == id {
			break
		}
	}
	if !strings.HasSuffix(p, id+".ini") && cc.Camera.ID != id {
		err = fmt.Errorf("Resource not found")
		return
	}

	stm := stream.NewStreamer()
	go stm.Subscribe(c)

	// handle subscription
	var brk broker.Broker
	var sub broker.Subscriber
	var h broker.Handler

	switch cc.Broker.Name {
	case "kafka":
		brk = kafka.NewBroker()
	case "nats":
		brk = nats.NewBroker()
	}
	if err = brk.Init(broker.Addrs(cc.Broker.Address)); err != nil {
		return
	}
	for {
		if err = brk.Connect(); err == nil {
			log.Infof("Connect success: url=[%s] brk=[%s]",
				c.FullPath(), cc.Broker.Address)

			break
		}
		log.Errorf("Connect failure! Retrying...: err=[%s] url=[%s] brk=[%s]",
			err.Error(), c.FullPath(), cc.Broker.Address)

		time.Sleep(time.Second * 1)
	}

	h = func(e broker.Event) (err error) {
		if err = e.Error(); err != nil {
			return
		}

		var frame CameraFrame
		if json.Unmarshal(e.Message().Body, &frame); frame.CameraID == id {
			stm.Notifier <- []byte(frame.Frame)
		}

		return
	}
	if sub, err = brk.Subscribe(cc.Broker.Topic, h); err != nil {
		return
	}
	log.Infof("Subscribe success: url=[%s] topic=[%s]",
		c.FullPath(), cc.Broker.Topic)

	select {
	case <-c.Done():
		// TODO: correct how to execute below
		if err = sub.Unsubscribe(); err != nil {
			return
		}
		log.Infof("Unsubscribe success: url=[%s] topic=[%s]",
			c.FullPath(), cc.Broker.Topic)

		if err = brk.Disconnect(); err != nil {
			return
		}
		log.Infof("Disconnect success: url=[%s] brk=[%s]",
			c.FullPath(), cc.Broker.Address)
	}

	return
}

// Read function
func (cc *CameraConfig) Read(id string) (err error) {
	var p string
	var ccm map[string]CameraConfig

	fini := ini.New()
	camDir := config.Get("sdm", "config_dir").String("")
	if err = fini.Fetch(camDir, &ccm); err != nil {
		return
	}
	for p, *cc = range ccm {
		if strings.HasSuffix(p, id+".ini") || cc.Camera.ID == id {
			break
		}
	}
	if !strings.HasSuffix(p, id+".ini") && cc.Camera.ID != id {
		err = fmt.Errorf("Resource not found")

		return
	}

	return
}

// Store function
func (cc *CameraConfig) Store(id string, c *gin.Context) (err error) {
	var p string
	var ccm map[string]CameraConfig

	fini := ini.New()
	camDir := config.Get("sdm", "config_dir").String("")
	if err = fini.Fetch(camDir, &ccm); err != nil {
		return
	}
	for p, *cc = range ccm {
		if strings.HasSuffix(p, id+".ini") || cc.Camera.ID == id {
			break
		}
	}
	if !strings.HasSuffix(p, id+".ini") && cc.Camera.ID != id {
		err = fmt.Errorf("Resource not found")

		return
	}

	if err = c.ShouldBindBodyWith(&cc, binding.JSON); err != nil {
		return
	}
	if err = fini.Update(&cc); err != nil {
		return
	}
	if err = fini.Save(p); err != nil {
		return
	}

	return
}

// ReadCalibrate function
func (cc *CameraConfig) ReadCalibrate(id string) (p string, err error) {
	var ccm map[string]CameraConfig

	fini := ini.New()
	camDir := config.Get("sdm", "config_dir").String("")
	if err = fini.Fetch(camDir, &ccm); err != nil {
		return
	}
	for p, *cc = range ccm {
		if strings.HasSuffix(p, id+".ini") || cc.Camera.ID == id {
			break
		}
	}
	if !strings.HasSuffix(p, id+".ini") && cc.Camera.ID != id {
		err = fmt.Errorf("Resource not found")

		return
	}

	p = strings.TrimSuffix(p, path.Ext(p)) + ".yml"

	return
}

// StoreCalibrate function
func (cc *CameraConfig) StoreCalibrate(id string, r io.Reader) (err error) {
	var p string
	var ccm map[string]CameraConfig

	fini := ini.New()
	camDir := config.Get("sdm", "config_dir").String("")
	if err = fini.Fetch(camDir, &ccm); err != nil {
		return
	}
	for p, *cc = range ccm {
		if strings.HasSuffix(p, id+".ini") || cc.Camera.ID == id {
			break
		}
	}
	if !strings.HasSuffix(p, id+".ini") && cc.Camera.ID != id {
		err = fmt.Errorf("Resource not found")
		return
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(r)
	p = strings.TrimSuffix(p, path.Ext(p)) + ".yml"
	if err = ioutil.WriteFile(p, buf.Bytes(), 0644); err != nil {
		return
	}

	return
}
