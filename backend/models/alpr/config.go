package alpr

import (
	"fmt"
	"reflect"
	"strings"

	"gitlab.com/brazncorp/web-ui/services/file/ini"
)

// Config struct
type Config struct {
	Camera1  *ConfigCamera `json:"camera-1,omitempty" ini:"[camera-1]"`
	Camera2  *ConfigCamera `json:"camera-2,omitempty" ini:"[camera-2]"`
	Camera3  *ConfigCamera `json:"camera-3,omitempty" ini:"[camera-3]"`
	Camera4  *ConfigCamera `json:"camera-4,omitempty" ini:"[camera-4]"`
	Camera5  *ConfigCamera `json:"camera-5,omitempty" ini:"[camera-5]"`
	Camera6  *ConfigCamera `json:"camera-6,omitempty" ini:"[camera-6]"`
	Camera7  *ConfigCamera `json:"camera-7,omitempty" ini:"[camera-7]"`
	Camera8  *ConfigCamera `json:"camera-8,omitempty" ini:"[camera-8]"`
	Camera9  *ConfigCamera `json:"camera-9,omitempty" ini:"[camera-9]"`
	Camera10 *ConfigCamera `json:"camera-10,omitempty" ini:"[camera-10]"`
}

// ConfigCamera struct
type ConfigCamera struct {
	URL string `json:"url" ini:"url"`
}

// Load define how to load from file
func (c *Config) Load(path string) (err error) {
	if path == "" {
		err = fmt.Errorf("Resource not found")

		return
	}

	fini := ini.New()
	err = fini.Load(path, c)

	return
}

// StringMap getter
func (c Config) StringMap() map[string]*ConfigCamera {
	rst := map[string]*ConfigCamera{}
	typ := reflect.TypeOf(c)

	for i := 0; i < typ.NumField(); i++ {
		val := reflect.ValueOf(c)
		fld := val.Type().Field(i)
		tag := fld.Tag.Get("json")

		// Skip if tag is not defined or ignored
		if tag == "" || tag == "-" {
			continue
		}

		cam := val.FieldByName(fld.Name).Interface().(*ConfigCamera)
		if cam == nil {
			continue
		}

		rst[tag[:strings.IndexRune(tag, ',')]] = cam
	}

	return rst
}
