package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/micro/go-micro/v2/config"
)

// DefaultPath function
var DefaultPath gin.HandlerFunc = func(c *gin.Context) {
	dfltPath := config.Get("server", "default_path").String("/")
	if c.Request.URL.Path == "/" && dfltPath != "" && dfltPath != "/" {
		c.Redirect(301, dfltPath)
	}
}
