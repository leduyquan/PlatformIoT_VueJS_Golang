package ini

import (
	goini "github.com/go-ini/ini"

	"gitlab.com/brazncorp/web-ui/services/file"
)

// New returns an initialized basic provider
func New(opts ...file.Option) file.File {
	var options file.Options
	for _, o := range opts {
		o(&options)
	}

	return &ini{reader: nil, opts: options}
}

type ini struct {
	reader *goini.File
	opts   file.Options
}

func (i *ini) String() string {
	return "ini"
}

func (i *ini) Load(path string, out interface{}) (err error) {
	if i.reader, err = goini.Load(path); err != nil {
		return
	}

	err = i.reader.MapTo(out)

	return
}

func (i *ini) Update(in interface{}) (err error) {
	err = i.reader.ReflectFrom(in)

	return
}

func (i *ini) Save(path string) (err error) {
	err = i.reader.SaveTo(path)

	return
}

// Fetch scan files that have relevant extension then return the array of struct
func (i *ini) Fetch(dir string, out interface{}) (err error) {
	err = file.Fetch(i, dir, out)

	return
}
