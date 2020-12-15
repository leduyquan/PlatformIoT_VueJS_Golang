package file

import (
	"context"
	"os"
	"path/filepath"
	"reflect"
)

// File is an interface abstraction for dynamic configuration
type File interface {
	// String returns the name of the provider
	String() string
	// Load reads the source file using concrete reader to object out
	Load(path string, out interface{}) error
	// Load update the current values from object in
	Update(in interface{}) error
	// Save saves the current values to target path
	Save(path string) error
	// Save saves the current values to target path
	Fetch(dir string, out interface{}) error
}

// Options struct
type Options struct {
	// for alternative data
	Context context.Context
}

// Option func
type Option func(o *Options)

// Fetch scan files that have relevant extension then return the array of struct
func Fetch(file File, dir string, out interface{}) (err error) {
	// get reflect type of out interface
	ctrTyp := reflect.TypeOf(out).Elem()
	kind := ctrTyp.Kind()

	// declare nil reflect value of out interface
	var ctr reflect.Value
	// declare behind reflect type of out interface incase it's collection type
	var typ reflect.Type

	err = filepath.Walk(dir, func(path string, f os.FileInfo, e error) (err error) {
		if e != nil {
			err = e

			return
		}

		if filepath.Ext(f.Name()) == "."+file.String() {
			path := filepath.Join(dir, f.Name())
			switch kind {
			case reflect.Array, reflect.Slice, reflect.Map:
				// init value of reflect out interface once
				if !ctr.IsValid() {
					ctr = reflect.ValueOf(out).Elem()
				}

				// init type of reflect out interface once
				if typ == nil {
					typ = ctrTyp.Elem()
				}

				// initialize an instance of behind type
				c := reflect.New(typ).Interface()
				if err = file.Load(path, c); e != nil {
					return
				}

				if c != nil {
					elem := reflect.ValueOf(c).Elem()
					switch kind {
					case reflect.Array, reflect.Slice:
						ctr.Set(reflect.Append(ctr, elem))
					case reflect.Map:
						if ctr.IsNil() {
							ctr.Set(reflect.MakeMap(ctrTyp))
						}
						ctr.SetMapIndex(reflect.ValueOf(path), elem)
					}
				}
			default:
				err = file.Load(path, out)

				return
			}
		}

		return
	})

	return
}
