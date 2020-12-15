package controllers

import (
	"bytes"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	log "github.com/micro/go-micro/v2/logger"

	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	msdm "gitlab.com/brazncorp/web-ui/models/dashboard/sdm"
	"gitlab.com/brazncorp/web-ui/services"
)

type sdm struct {
}

// CameraFrame struct
type CameraFrame struct {
	CameraID string `json:"camera_id"`
	Frame    string `json:"frame"`
}

func (s *sdm) StreamCamera(c *gin.Context) {
	var err error
	var m msdm.CameraConfig

	id := c.Params.ByName("id")

	// for purpose log request when error occurs
	var reqBuf bytes.Buffer
	c.Request.Body = ioutil.NopCloser(io.TeeReader(c.Request.Body, &reqBuf))
	defer func() {
		c.Request.Body.Close()
		reqBuf.Reset()
		services.HandleError(err, c, &reqBuf)
	}()

	if err = m.Stream(id, c); err != nil {
		return
	}
}

func (s *sdm) GetConfig(c *gin.Context) {
	var err error
	var m msdm.Config

	// for purpose log request when error occurs
	var reqBuf bytes.Buffer
	c.Request.Body = ioutil.NopCloser(io.TeeReader(c.Request.Body, &reqBuf))
	defer func() {
		c.Request.Body.Close()
		reqBuf.Reset()
		services.HandleError(err, c, &reqBuf)
	}()

	if err = m.Read(); err != nil {
		return
	}

	if e := m.CheckServices(); e != nil {
		log.Warnf("Check services status failed!: err=[%s]", e.Error())
	}

	services.Respond(c, http.StatusOK, services.SUCCESS, mcommon.Rsp.Respond(m))
}

func (s *sdm) GetCameraConfig(c *gin.Context) {
	var err error
	var m msdm.CameraConfig

	id := c.Params.ByName("id")

	// for purpose log request when error occurs
	var reqBuf bytes.Buffer
	c.Request.Body = ioutil.NopCloser(io.TeeReader(c.Request.Body, &reqBuf))
	defer func() {
		c.Request.Body.Close()
		reqBuf.Reset()
		services.HandleError(err, c, &reqBuf)
	}()

	if err = m.Read(id); err != nil {
		return
	}

	services.Respond(c, http.StatusOK, services.SUCCESS, mcommon.Rsp.Respond(m))
}

func (s *sdm) StoreCameraConfig(c *gin.Context) {
	var err error
	var m msdm.CameraConfig

	id := c.Params.ByName("id")

	// for purpose log request when error occurs
	var reqBuf bytes.Buffer
	c.Request.Body = ioutil.NopCloser(io.TeeReader(c.Request.Body, &reqBuf))
	defer func() {
		c.Request.Body.Close()
		reqBuf.Reset()
		services.HandleError(err, c, &reqBuf)
	}()

	if err = m.Store(id, c); err != nil {
		return
	}

	services.Respond(c, http.StatusOK, services.SUCCESS)
}

func (s *sdm) DeleteCameraConfig(c *gin.Context) {
	// TODO: define the logic
	services.Respond(c, http.StatusOK, services.SUCCESS)
}

func (s *sdm) GetCameraCalibrate(c *gin.Context) {
	var err error
	var p string
	var m msdm.CameraConfig

	id := c.Params.ByName("id")

	// for purpose log request when error occurs
	var reqBuf bytes.Buffer
	c.Request.Body = ioutil.NopCloser(io.TeeReader(c.Request.Body, &reqBuf))
	defer func() {
		c.Request.Body.Close()
		reqBuf.Reset()
		services.HandleError(err, c, &reqBuf)
	}()

	if p, err = m.ReadCalibrate(id); err != nil {
		return
	}

	c.File(p)
}

func (s *sdm) StoreCameraCalibrate(c *gin.Context) {
	var err error
	var m msdm.CameraConfig

	id := c.Params.ByName("id")

	// for purpose log request when error occurs
	var reqBuf bytes.Buffer
	c.Request.Body = ioutil.NopCloser(io.TeeReader(c.Request.Body, &reqBuf))
	defer func() {
		c.Request.Body.Close()
		reqBuf.Reset()
		services.HandleError(err, c, &reqBuf)
	}()

	if err = m.StoreCalibrate(id, c.Request.Body); err != nil {
		return
	}

	// restart service after calibration automatically
	if e := msdm.RestartEngine("detection_" + id); e != nil {
		log.Warnf("Restart service failed!: err=[%s]", e.Error())
	}

	services.Respond(c, http.StatusOK, services.SUCCESS)
}

func (s *sdm) RestartService(c *gin.Context) {
	var err error

	name := c.Params.ByName("name")

	// for purpose log request when error occurs
	var reqBuf bytes.Buffer
	c.Request.Body = ioutil.NopCloser(io.TeeReader(c.Request.Body, &reqBuf))
	defer func() {
		c.Request.Body.Close()
		reqBuf.Reset()
		services.HandleError(err, c, &reqBuf)
	}()

	if err = msdm.RestartEngine(name); err != nil {
		return
	}

	services.Respond(c, http.StatusOK, services.SUCCESS)
}
