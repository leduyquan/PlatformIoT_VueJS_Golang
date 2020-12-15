package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	log "github.com/micro/go-micro/v2/logger"

	"gitlab.com/brazncorp/util/str"
	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	msetting "gitlab.com/brazncorp/web-ui/models/system/setting"
)

type setting struct {
}

// AgentRead function
func (s *setting) AgentRead(c *gin.Context) {
	data, err := (&msetting.SettingAgent{}).Read()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Read agent failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Read agent successfully",
		"data":    mcommon.Rsp.Respond(data),
	})
}

// AgentUpdate function
func (s *setting) AgentUpdate(c *gin.Context) {
	var req msetting.AgentRequest
	if err := c.BindJSON(&req); nil != err {
		log.Warn("Parse request failed: ", str.Beautify(map[string]interface{}{
			"err_msg": err.Error(),
			"err":     err,
		}))
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Invalid request",
		})

		return
	}

	if err := (&msetting.SettingAgent{}).Save(req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Save agent failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Save agent successfully",
	})
}

// CameraDirectory function
func (s *setting) CameraDirectory(c *gin.Context) {
	data, err := (&msetting.SettingCamera{}).Directory()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Read camera failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Read camera successfully",
		"data":    mcommon.Rsp.Respond(data),
	})
}

// CameraRead function
func (s *setting) CameraRead(c *gin.Context) {
	data, err := (&msetting.SettingCamera{}).Read()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Read camera failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Read camera successfully",
		"data":    mcommon.Rsp.Respond(data),
	})
}

// CameraFetch function
func (s *setting) CameraFetch(c *gin.Context) {
	var req msetting.CameraRequest
	if err := c.BindJSON(&req); nil != err {
		log.Error("Parse request failed: ", str.Beautify(map[string]interface{}{
			"err_msg": err.Error(),
			"err":     err,
		}))
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Invalid request",
		})

		return
	}

	data, err := (&msetting.SettingCamera{}).Fetch(req)
	if nil != err {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Fetch camera failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Fetch camera successfully",
		"data":    mcommon.Rsp.Respond(data),
	})
}
