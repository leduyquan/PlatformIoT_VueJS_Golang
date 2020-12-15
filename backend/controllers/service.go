package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	maudit "gitlab.com/brazncorp/web-ui/models/system/audit"
)

type service struct {
}

func (b *service) GetAuditLogs(c *gin.Context) {
	var m maudit.Audit
	var res = map[string]interface{}{
		"page":    c.DefaultQuery("page", "1"),
		"size":    c.DefaultQuery("size", "10"),
		"keyword": c.Query("keyword"),
	}

	rsp, err := m.Get(res)
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
