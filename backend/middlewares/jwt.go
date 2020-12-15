package middlewares

import (
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"

	"gitlab.com/brazncorp/web-ui/services"
	"gitlab.com/brazncorp/web-ui/services/cache"
)

const (
	AuthorizationHeaderKey    = "Authorization"
	AuthorizationHeaderPrefix = "Bearer "
)

var jwtSecret = []byte("Br@zn@2sims")

// Auth function
var Auth gin.HandlerFunc = func(c *gin.Context) {
	var data interface{}

	code := ValidToken(c)
	if code != services.SUCCESS {
		services.Respond(c, http.StatusUnauthorized, code, data)
		c.Abort()
		return
	}

	c.Next()
}

func ValidToken(c *gin.Context) int {
	token := ExtractToken(c)
	claim, err := ParseToken(token)
	if err != nil {
		switch err.(*jwt.ValidationError).Errors {
		case jwt.ValidationErrorExpired:
			return services.ErrorAuthCheckTokenTimeout
		default:
			return services.ErrorAuthCheckTokenFail
		}
	}

	value, found := cache.CacheStore.Get(claim.UuId)
	if !found {
		return services.ErrorAuthCheckTokenFail
	}

	c.Set("email", value)
	return services.SUCCESS
}

func ExtractToken(c *gin.Context) string {
	header := c.GetHeader(AuthorizationHeaderKey)
	if header == "" {
		return ""
	}

	if !strings.HasPrefix(header, AuthorizationHeaderPrefix) {
		return ""
	}
	return strings.TrimPrefix(header, AuthorizationHeaderPrefix)
}
