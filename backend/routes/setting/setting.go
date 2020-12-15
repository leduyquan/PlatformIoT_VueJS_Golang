package setting

import (
	"github.com/gin-gonic/gin"

	"gitlab.com/brazncorp/web-ui/controllers"
	"gitlab.com/brazncorp/web-ui/middlewares"
	"gitlab.com/brazncorp/web-ui/routes"
)

type setting struct {
	controller controllers.Setting
}

func init() {
	routes.Master.Init(routes.WithRouter(&setting{
		controller: controllers.NewSetting(),
	}))
}

func (s *setting) SetupRouter(r *gin.Engine) {
	v1 := r.Group("/api/v1")
	v1.Use(middlewares.Auth)
	{
		ar := v1.Group("/admin/setting")
		ar.GET("agent", s.controller.AgentRead)
		ar.PUT("agent", s.controller.AgentUpdate)
		ar.GET("camera", s.controller.CameraRead)
		ar.GET("camera/directory", s.controller.CameraDirectory)
		ar.POST("camera/fetch", s.controller.CameraFetch)
	}
}
