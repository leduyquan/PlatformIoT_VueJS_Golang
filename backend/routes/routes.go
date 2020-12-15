package routes

import (
	"context"

	"github.com/gin-gonic/gin"
)

// Master hold all registration routes
var Master = NewRouterMaster()

// Router defines how to interface with client
type Router interface {
	SetupRouter(r *gin.Engine)
}

// RouterMaster defines master instance of module routes
type RouterMaster struct {
	opts Options
}

// NewRouterMaster return master instance
func NewRouterMaster(opts ...Option) *RouterMaster {
	var options Options

	for _, o := range opts {
		o(&options)
	}

	return &RouterMaster{opts: options}
}

// Init initializes instance functions
func (rt *RouterMaster) Init(opts ...Option) {
	for _, o := range opts {
		o(&rt.opts)
	}
}

// SetupRouters registers routes
func (rt *RouterMaster) SetupRouters(routers ...Router) {
	for _, r := range routers {
		o := WithRouter(r)
		o(&rt.opts)
	}

	for _, c := range rt.opts.routers {
		c.SetupRouter(rt.opts.engine)
	}
}

// Options defines master instance functions' properties
type Options struct {
	engine  *gin.Engine
	routers []Router

	// for alternative data
	Context context.Context
}

// Option returns how to assign funcion
type Option func(o *Options)
