package services

import (
	"io/ioutil"

	"github.com/micro/go-micro/v2/config"
	"github.com/micro/go-micro/v2/config/reader"
	"github.com/micro/go-micro/v2/config/source/file"

	"gitlab.com/brazncorp/util/str"
)

// JSON interface
type JSON interface {
	Read(path string, data interface{}, key ...string) (config.Config, error)
	Write(path string, config config.Config) (err error)
}

// DefaultJSON struct
type DefaultJSON struct {
}

// Read function
func (j DefaultJSON) Read(path string, data interface{}, key ...string) (config.Config, error) {
	if "" == path {
		return nil, nil
	}

	s := config.WithSource(file.NewSource(file.WithPath(path)))
	c, err := config.NewConfig(s)
	if err != nil {
		return nil, err
	}

	var val reader.Value
	if len(key) == 0 {
		val = c.Get()
	} else {
		val = c.Get(key...)
	}

	val.Scan(data)

	return c, err
}

// Write function
func (j DefaultJSON) Write(path string, config config.Config) (err error) {
	var data interface{}
	if err = config.Scan(&data); nil != err {
		return
	}

	err = ioutil.WriteFile(path, []byte(str.Beautify(data)), 0644)

	return
}
