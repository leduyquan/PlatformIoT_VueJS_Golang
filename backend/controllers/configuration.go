package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"gitlab.com/brazncorp/web-ui/models"
	maccount "gitlab.com/brazncorp/web-ui/models/account"
	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	"gitlab.com/brazncorp/web-ui/services"
)

type configuration struct {
}

func (cf *configuration) GetModules(c *gin.Context) {
	var perm maccount.Permission
	var m models.Module
	perms, err := perm.GetByRole([]string{})
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorGetFailed, nil)
	}
	var module []map[string]interface{}
	m.GetModules(&module)

	data := map[string]interface{}{
		"permission": perms,
		"module":     module,
	}

	services.Respond(c, http.StatusOK, services.SUCCESS, mcommon.Rsp.Respond(data))
}
