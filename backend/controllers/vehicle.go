package controllers

import (
	"net/http"

	model "gitlab.com/brazncorp/web-ui/models/vehicle"

	"github.com/gin-gonic/gin"

	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	mvehicle "gitlab.com/brazncorp/web-ui/models/dashboard/vehicle"
	"gitlab.com/brazncorp/web-ui/services"
)

type vehicle struct {
}

// Admin APIs
// ReadPlates function
func (v *vehicle) ReadPlates(c *gin.Context) {
	data, err := (&mvehicle.Vehicle{}).ReadPlates()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Read plates failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Read plates successfully",
		"data":    mcommon.Rsp.Respond(data),
	})
}

// ReadCategories function
func (v *vehicle) ReadCategories(c *gin.Context) {
	data, err := (&mvehicle.Vehicle{}).ReadCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Read categories failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Read categories successfully",
		"data":    mcommon.Rsp.Respond(data),
	})
}

// ReadRules function
func (v *vehicle) ReadRules(c *gin.Context) {
	data, err := (&mvehicle.Vehicle{}).ReadRules()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Read rules failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Read rules successfully",
		"data":    mcommon.Rsp.Respond(data),
	})
}

// SyncPlates function
func (v *vehicle) SyncPlates(c *gin.Context) {
	data, err := (&mvehicle.Vehicle{}).SyncPlates()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Sync. plates failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Sync. plates successfully",
		"data":    mcommon.Rsp.Respond(data),
	})
}

// SyncCategories function
func (v *vehicle) SyncCategories(c *gin.Context) {
	data, err := (&mvehicle.Vehicle{}).SyncCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Sync. categories failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Sync. categories successfully",
		"data":    mcommon.Rsp.Respond(data),
	})
}

// SyncRules function
func (v *vehicle) SyncRules(c *gin.Context) {
	data, err := (&mvehicle.Vehicle{}).SyncRules()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     "Sync. rules failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Sync. rules successfully",
		"data":    mcommon.Rsp.Respond(data),
	})
}

// Dashboard APIs
// GetFilterData
func (v *vehicle) GetFilterData(c *gin.Context) {
	var m mvehicle.Vehicle
	data := m.GetFilterData()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Get successfully",
		"data":    mcommon.Rsp.Respond(data),
	})
}

func (v *vehicle) GetList(c *gin.Context) {
	// Use LP model for now
	var fltr model.LpFilter
	if err := c.ShouldBindQuery(&fltr); nil != err {
		services.Respond(c, http.StatusBadRequest, services.InvalidParams, nil)

		return
	}

	veh := model.NewVehicle()
	data, err := veh.List(fltr)

	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ERROR, nil)
		return
	}

	services.Respond(c, http.StatusOK, services.SUCCESS, data)
}
