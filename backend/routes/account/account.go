package account

import (
	"github.com/gin-gonic/gin"

	"gitlab.com/brazncorp/web-ui/controllers"
	"gitlab.com/brazncorp/web-ui/middlewares"
	"gitlab.com/brazncorp/web-ui/routes"
)

type account struct {
	controller controllers.Account
}

func init() {
	routes.Master.Init(routes.WithRouter(&account{
		controller: controllers.NewAccount(),
	}))
}

func (v *account) SetupRouter(r *gin.Engine) {
	v1 := r.Group("/api/v1")
	v1.POST("login", v.controller.Login)
	v1.POST("logout", v.controller.Logout)
	v1.POST("token/refresh", v.controller.Refresh)
	v1.Use(middlewares.Auth)
	{
		api := v1.Group("/admin/account")
		api.GET("users", v.controller.ReadUsers)
		api.GET("users/:id", v.controller.ReadUser)
		api.POST("users", v.controller.CreateUser)
		api.PUT("users/:id", v.controller.UpdateUser)

		api.GET("roles", v.controller.ReadRoles)
		api.GET("roles/:id", v.controller.ReadRole)
		api.POST("roles", v.controller.UpdateRole)
		api.PUT("roles/:id", v.controller.UpdateRole)

		v1.POST("profiles", v.controller.UpdateProfile)
		v1.POST("profiles/password/change", v.controller.ChangePassword)
		v1.GET("profiles", v.controller.GetProfile)
	}
}
