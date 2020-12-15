package sdm

import (
	"github.com/gin-gonic/gin"

	"gitlab.com/brazncorp/web-ui/controllers"
	"gitlab.com/brazncorp/web-ui/routes"
)

type sdm struct {
	controller controllers.SDM
}

func init() {
	routes.Master.Init(routes.WithRouter(&sdm{
		controller: controllers.NewSDM(),
	}))
}

func (b *sdm) SetupRouter(r *gin.Engine) {
	var v1 *gin.RouterGroup

	v1 = r.Group("/stream/v1")
	v1.Use()
	{
		ar := v1.Group("")
		ar.GET("sdm/camera/:id", b.controller.StreamCamera)
	}

	v1 = r.Group("/api/v1")
	v1.Use()
	{
		ar := v1.Group("/admin")
		ar.GET("sdm", b.controller.GetConfig)
		ar.GET("sdm/camera", b.controller.GetConfig)
		ar.GET("sdm/camera/:id", b.controller.GetCameraConfig)
		ar.POST("sdm/camera", b.controller.StoreCameraConfig)
		ar.PUT("sdm/camera/:id", b.controller.StoreCameraConfig)
		ar.DELETE("sdm/camera/:id", b.controller.DeleteCameraConfig)
		ar.GET("sdm/camera/:id/calibrate", b.controller.GetCameraCalibrate)
		ar.PUT("sdm/camera/:id/calibrate", b.controller.StoreCameraCalibrate)
		ar.POST("sdm/service/:name/restart", b.controller.RestartService)
	}
}
