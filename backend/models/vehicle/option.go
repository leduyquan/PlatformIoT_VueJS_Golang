package vehicle

import (
	"context"
	"image"
	"time"

	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	mcoll "gitlab.com/brazncorp/web-ui/models/common/collection"
)

// Options struct
type Options struct {
	FileName       string        `json:"file_name"`
	ProcessingTime time.Duration `json:"processing_time"`
	Timestamp      time.Time     `json:"timestamp"`
	Image          image.Image   `json:"image"`

	Plate      string      `json:"plate"`
	PlateScore float32     `json:"plate_score"`
	PlateBox   []int       `json:"plate_box"`
	PlateImage image.Image `json:"plate_image"`

	Region      string      `json:"region"`
	RegionScore float32     `json:"region_score"`
	RegionBox   []int       `json:"region_box"`
	RegionImage image.Image `json:"region_image"`

	VehicleScore float32     `json:"vehicle_score"`
	VehicleBox   []int       `json:"vehicle_box"`
	VehicleType  string      `json:"vehicle_type"`
	VehicleImage image.Image `json:"vehicle_image"`

	// Store
	ID interface{}

	// Wrapper
	Item       Vehicle
	Collection mcoll.Collection

	// Extended data
	Context context.Context
}

// Option function
type Option func(o *Options)

// Collection function
func Collection(coll mcoll.Collection) Option {
	return func(o *Options) {
		o.Collection = coll
		o.Collection.Init(mcoll.Items(&o.Item))
	}
}

// FileName function
func FileName(fn string) Option {
	return func(o *Options) {
		o.FileName = fn
	}
}

// ProcessingTime function
func ProcessingTime(pt float32) Option {
	return func(o *Options) {
		o.ProcessingTime = time.Duration(pt*1000) * time.Millisecond
	}
}

// Timestamp function
func Timestamp(tm string) Option {
	return func(o *Options) {
		var err error
		o.Timestamp, err = time.Parse(time.RFC3339, tm)
		if err != nil {
			panic(err)
		}
	}
}

// Image function
func Image(b64 string) Option {
	return func(o *Options) {
		var err error
		o.Image, _, err = mcommon.Img.FromBase64(b64)
		if err != nil {
			panic(err)
		}
	}
}

// Plate function
func Plate(plt string) Option {
	return func(o *Options) {
		o.Plate = plt
	}
}

// PlateScore function
func PlateScore(sc float32) Option {
	return func(o *Options) {
		o.PlateScore = sc
	}
}

// PlateBox function
func PlateBox(bx []int) Option {
	return func(o *Options) {
		o.PlateBox = bx
	}
}

// PlateImage function
func PlateImage(b64 string) Option {
	return func(o *Options) {
		var err error
		o.PlateImage, _, err = mcommon.Img.FromBase64(b64)
		if err != nil {
			panic(err)
		}
	}
}

// Region function
func Region(rgn string) Option {
	return func(o *Options) {
		o.Region = rgn
	}
}

// RegionScore function
func RegionScore(sc float32) Option {
	return func(o *Options) {
		o.RegionScore = sc
	}
}

// RegionBox function
func RegionBox(bx []int) Option {
	return func(o *Options) {
		o.RegionBox = bx
	}
}

// RegionImage function
func RegionImage(b64 string) Option {
	return func(o *Options) {
		var err error
		o.RegionImage, _, err = mcommon.Img.FromBase64(b64)
		if err != nil {
			panic(err)
		}
	}
}

// VehicleScore function
func VehicleScore(sc float32) Option {
	return func(o *Options) {
		o.VehicleScore = sc
	}
}

// VehicleBox function
func VehicleBox(bx []int) Option {
	return func(o *Options) {
		o.VehicleBox = bx
	}
}

// VehicleType function
func VehicleType(typ string) Option {
	return func(o *Options) {
		o.VehicleType = typ
	}
}

// VehicleImage function
func VehicleImage(b64 string) Option {
	return func(o *Options) {
		var err error
		o.VehicleImage, _, err = mcommon.Img.FromBase64(b64)
		if err != nil {
			panic(err)
		}
	}
}
