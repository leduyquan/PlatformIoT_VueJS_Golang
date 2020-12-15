package configuration

import (
	"github.com/gin-gonic/gin"

	"gitlab.com/brazncorp/web-ui/controllers"
	"gitlab.com/brazncorp/web-ui/middlewares"
	"gitlab.com/brazncorp/web-ui/routes"
)

type configuration struct {
	controller controllers.Configuration
}

func init() {
	routes.Master.Init(routes.WithRouter(&configuration{
		controller: controllers.NewConfiguration(),
	}))
}

func (c *configuration) SetupRouter(r *gin.Engine) {
	v1 := r.Group("/api/v1")
	v1.Use(middlewares.Auth)
	{
		ar := v1.Group("/admin/configuration")
		ar.GET("modules", c.controller.GetModules)
	}
}
