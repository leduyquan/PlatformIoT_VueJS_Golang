package vehicle

import (
	"github.com/gin-gonic/gin"

	"gitlab.com/brazncorp/web-ui/controllers"
	"gitlab.com/brazncorp/web-ui/middlewares"
	"gitlab.com/brazncorp/web-ui/routes"
)

type vehicle struct {
	controller controllers.Vehicle
}

func init() {
	routes.Master.Init(routes.WithRouter(&vehicle{
		controller: controllers.NewVehicle(),
	}))
}

func (v *vehicle) SetupRouter(r *gin.Engine) {
	v1 := r.Group("/api/v1")
	v1.Use(middlewares.Auth)
	{
		ar := v1.Group("/admin/vehicle")
		ar.GET("plates", v.controller.ReadPlates)
		ar.GET("categories", v.controller.ReadCategories)
		ar.GET("rules", v.controller.ReadRules)
		ar.POST("plates", v.controller.SyncPlates)
		ar.POST("categories", v.controller.SyncCategories)
		ar.POST("rules", v.controller.SyncRules)

		dr := v1.Group("/vehicle")
		dr.GET("filter-data", v.controller.GetFilterData)
		dr.GET("list", v.controller.GetList)
	}
}
