package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	log "github.com/micro/go-micro/v2/logger"

	"gitlab.com/brazncorp/web-ui/models"
	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	mbarrier "gitlab.com/brazncorp/web-ui/models/dashboard/barrier"
	"gitlab.com/brazncorp/web-ui/services"
)

type barrier struct {
}

func (b *barrier) Get(c *gin.Context) {
	var m mbarrier.Barrier
	rsp, err := m.All()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Get successfully",
		"data":    mcommon.Rsp.Respond(rsp),
	})
}

func (b *barrier) Store(c *gin.Context) {
	id := c.Params.ByName("id")
	var m mbarrier.Barrier
	c.BindJSON(&m)

	err := m.Save(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     err.Error(),
		})
		return
	}

	go func() {
		if err := m.SyncUp(); err != nil {
			log.Error(err)
		}
	}()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Save successfully",
	})
}

func (b *barrier) Detail(c *gin.Context) {
	id := c.Params.ByName("id")
	var m mbarrier.Barrier
	err := m.Detail(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Get successfully",
		"data":    mcommon.Rsp.Respond(m),
	})
}

func (b *barrier) Delete(c *gin.Context) {
	var m mbarrier.Barrier
	id := c.Params.ByName("id")
	err := m.Delete(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    0,
			"msg":     err.Error(),
		})
		return
	}

	go func() {
		if err := m.SyncUp(); err != nil {
			log.Error(err)
		}
	}()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    1,
		"msg":     "Deleted",
	})
}

func (b *barrier) GetLogs(c *gin.Context) {
	var fltr models.BarrierLogFilter
	if err := c.ShouldBindQuery(&fltr); nil != err {
		services.Respond(c, http.StatusBadRequest, services.InvalidParams, nil)

		return
	}

	data, err := models.NewBarrierLog().GetLogs(fltr)
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ERROR, nil)

		return
	}

	services.Respond(c, http.StatusOK, services.SUCCESS, data)
}
