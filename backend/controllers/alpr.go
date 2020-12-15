package controllers

import (
	"bytes"
	"encoding/json"
	"image"
	"io"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"gocv.io/x/gocv"

	"github.com/gin-gonic/gin"
	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"

	malpr "gitlab.com/brazncorp/web-ui/models/alpr"
	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	"gitlab.com/brazncorp/web-ui/services"
	"gitlab.com/brazncorp/web-ui/stream"
)

// CONFIG prefix, TODO: will define how to load it automatically
const CONFIG = "alpr"

type alpr struct {
	s *stream.Streamer
}

func (a *alpr) Webhook(c *gin.Context) {
	var err error

	// for purpose log request when error occurs
	var reqBuf bytes.Buffer
	c.Request.Body = ioutil.NopCloser(io.TeeReader(c.Request.Body, &reqBuf))
	defer func() {
		c.Request.Body.Close()
		reqBuf.Reset()
		services.HandleError(err, c, &reqBuf)
	}()

	var m malpr.DataHook
	body := c.PostForm("json")
	_ = json.Unmarshal([]byte(body), &m)
	data, _ := m.ProcessData()
	if err = malpr.Create(data); err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ERROR, nil)
		log.Error(err)
		return
	}

	go malpr.StreamData(a.s, data)
	services.Respond(c, http.StatusOK, services.SUCCESS, nil)
}

func (a *alpr) GetLP(c *gin.Context) {
	var fltr malpr.LpFilter
	if err := c.ShouldBindQuery(&fltr); nil != err {
		services.Respond(c, http.StatusBadRequest, services.InvalidParams, nil)

		return
	}

	data, err := malpr.Get(fltr)
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ERROR, nil)
		return
	}

	services.Respond(c, http.StatusOK, services.SUCCESS, data)
}

func (a *alpr) GetConfig(c *gin.Context) {
	var err error

	// for purpose log request when error occurs
	var reqBuf bytes.Buffer
	c.Request.Body = ioutil.NopCloser(io.TeeReader(c.Request.Body, &reqBuf))
	defer func() {
		c.Request.Body.Close()
		reqBuf.Reset()
		services.HandleError(err, c, &reqBuf)
	}()

	p := filepath.Join(config.Get(CONFIG, "config_dir").String(""), "config.ini")
	var m malpr.Config
	if err = m.Load(p); err != nil {
		return
	}

	// mask sensitive data
	strMap := m.StringMap()
	for k := range strMap {
		strMap[k].URL = strings.Repeat("*", len(strMap[k].URL))
	}

	services.Respond(c, http.StatusOK, services.SUCCESS, mcommon.Rsp.Respond(strMap))
}

func (a *alpr) StreamLP(c *gin.Context) {
	a.s.Subscribe(c)
}

func (a *alpr) StreamVideoFeed(c *gin.Context) {
	var err error

	id := c.Params.ByName("id")

	// for purpose log request when error occurs
	var reqBuf bytes.Buffer
	c.Request.Body = ioutil.NopCloser(io.TeeReader(c.Request.Body, &reqBuf))
	defer func() {
		c.Request.Body.Close()
		reqBuf.Reset()
		services.HandleError(err, c, &reqBuf)
	}()

	p := filepath.Join(config.Get(CONFIG, "config_dir").String(""), "config.ini")
	var m malpr.Config
	if err = m.Load(p); err != nil {
		return
	}

	strMap := m.StringMap()
	stm := stream.NewStreamer()
	go stm.Subscribe(c)

	img := gocv.NewMat()
	defer img.Close()

	var url = strMap[id].URL
	var webcam *gocv.VideoCapture
	if webcam, err = gocv.OpenVideoCapture(url); err != nil {
		return
	}
	defer webcam.Close()
	go func() {
		if ok := webcam.Read(&img); !ok {
			log.Warnf("Video feed is unavailable: url=[%s]", url)

			return
		}
		sz := computeVideoFeedResolution(&img)
		for {
			if ok := webcam.Read(&img); !ok {
				log.Warnf("Video feed is unavailable: url=[%s]", url)
				time.Sleep(time.Second * 1)
				continue
			}
			if img.Empty() {
				continue
			}

			gocv.Resize(img, &img, sz, 0.0, 0.0, gocv.InterpolationArea)
			buf, _ := gocv.IMEncode(".jpeg", img)
			stm.Notifier <- buf
		}
	}()

	select {
	case <-c.Done():
	}
}

func computeVideoFeedResolution(img *gocv.Mat) (pt image.Point) {
	w := config.Get(CONFIG, "camera_resolution", "width").Int(0)
	h := config.Get(CONFIG, "camera_resolution", "height").Int(0)

	switch {
	case w <= 0 && h <= 0:
		w = img.Cols()
		h = img.Rows()
	case w <= 0:
		w = h * img.Cols() / img.Rows()
	case h <= 0:
		h = w * img.Rows() / img.Cols()
	}

	pt = image.Pt(w, h)

	return
}
