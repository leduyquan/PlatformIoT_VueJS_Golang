package barrier

import (
	"github.com/gin-gonic/gin"

	"gitlab.com/brazncorp/web-ui/controllers"
	"gitlab.com/brazncorp/web-ui/middlewares"
	"gitlab.com/brazncorp/web-ui/routes"
)

type barrier struct {
	controller controllers.Barrier
}

func init() {
	routes.Master.Init(routes.WithRouter(&barrier{
		controller: controllers.NewBarrier(),
	}))
}

func (b *barrier) SetupRouter(r *gin.Engine) {
	v1 := r.Group("/api/v1")
	v1.Use(middlewares.Auth)
	{
		ar := v1.Group("/admin")
		ar.GET("barriers", b.controller.Get)
		ar.GET("barrier/:id", b.controller.Detail)
		ar.POST("barrier", b.controller.Store)
		ar.PUT("barrier/:id", b.controller.Store)
		ar.DELETE("barrier/:id", b.controller.Delete)

		dr := v1.Group("/barriers")
		dr.GET("logs", b.controller.GetLogs)
	}
}
