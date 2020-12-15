package service

import (
	"github.com/gin-gonic/gin"

	"gitlab.com/brazncorp/web-ui/controllers"
	"gitlab.com/brazncorp/web-ui/middlewares"
	"gitlab.com/brazncorp/web-ui/routes"
)

type service struct {
	controller controllers.Service
}

func init() {
	routes.Master.Init(routes.WithRouter(&service{
		controller: controllers.NewService(),
	}))
}

func (b *service) SetupRouter(r *gin.Engine) {
	v1 := r.Group("/api/v1")
	v1.Use(middlewares.Auth)
	{
		ar := v1.Group("/admin")
		ar.GET("audits", b.controller.GetAuditLogs)
	}
}
