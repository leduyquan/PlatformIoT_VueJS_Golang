package routes

import (
	"github.com/gin-gonic/gin"
)

// WithEngine sets the Gin-Gonic engine function
func WithEngine(e *gin.Engine) Option {
	return func(o *Options) {
		o.engine = e
	}
}

// WithRouter sets the router function
func WithRouter(r Router) Option {
	return func(o *Options) {
		o.routers = append(o.routers, r)
	}
}

// WithRouters sets the collection of routers function
func WithRouters(rs ...Router) Option {
	return func(o *Options) {
		o.routers = rs
	}
}
