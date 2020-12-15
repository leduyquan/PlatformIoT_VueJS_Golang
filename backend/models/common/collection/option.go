package collection

import (
	"context"
)

// Options struct
type Options struct {
	Items []interface{}

	// store
	StoreName string

	// Extended data
	Context context.Context
}

// Option function
type Option func(o *Options)

// Items function
func Items(is ...interface{}) Option {
	return func(o *Options) {
		o.Items = append(o.Items, is...)
	}
}

// StoreName function
func StoreName(sn string) Option {
	return func(o *Options) {
		o.StoreName = sn
	}
}
