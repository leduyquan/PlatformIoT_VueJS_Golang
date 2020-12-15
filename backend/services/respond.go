package services

import (
	"reflect"
)

// Response interface
type Response interface {
	Respond(data interface{}) interface{}
}

// DefaultResponse struct
type DefaultResponse struct {
}

// Respond function
func (r DefaultResponse) Respond(data interface{}) interface{} {
	if reflect.DeepEqual(data, reflect.Zero(reflect.TypeOf(data)).Interface()) {
		return []interface{}{}
	}

	return data
}
