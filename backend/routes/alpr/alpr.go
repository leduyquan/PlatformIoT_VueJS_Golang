package alpr

import (
	"github.com/gin-gonic/gin"

	"gitlab.com/brazncorp/web-ui/controllers"
	"gitlab.com/brazncorp/web-ui/routes"
)

type alpr struct {
	controller controllers.ALPR
}

func init() {
	routes.Master.Init(routes.WithRouter(&alpr{
		controller: controllers.NewALPR(),
	}))
}

func (b *alpr) SetupRouter(r *gin.Engine) {
	var v1 *gin.RouterGroup

	v1 = r.Group("/stream/v1")
	v1.Use()
	{
		ar := v1.Group("")
		ar.GET("alpr/lp", b.controller.StreamLP)
		ar.GET("alpr/camera/:id/feed", b.controller.StreamVideoFeed)
	}

	v1 = r.Group("/api/v1")
	v1.Use()
	{
		ar := v1.Group("")
		ar.POST("alpr/webhook", b.controller.Webhook)
		ar.GET("alpr/config", b.controller.GetConfig)
		ar.GET("alpr/lp", b.controller.GetLP)
	}
}
