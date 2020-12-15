package vehicle

import (
	"encoding/json"
	"fmt"
	"image"
	"reflect"
	"strings"
	"time"

	"gitlab.com/brazncorp/util/pagination"
	mcommon "gitlab.com/brazncorp/web-ui/models/common"

	log "github.com/micro/go-micro/v2/logger"
	db "gitlab.com/brazncorp/util/config/database"
)

// TODO: Refer https://github.com/asim/go-micro/blob/master/store/store.go to build store interface
var StoreName = "alpr_events"

// DefaultVehicle struct
type DefaultVehicle struct {
	opts Options
}

// ALPR struct
type ALPR struct {
	Filename       string   `json:"filename"`
	ProcessingTime float32  `json:"processing_time"`
	Results        []Result `json:"results"`
	Timestamp      string   `json:"timestamp"`
}

// Result struct
type Result struct {
	Box             []int      `json:"box"`
	Plate           string     `json:"plate"`
	PlateCropBase64 string     `json:"plate_crop_base64"`
	Region          string     `json:"region"`
	RegionBase64    string     `json:"region_base64"`
	RegionBox       []int      `json:"region_box"`
	RegionScore     float32    `json:"region_score"`
	Score           float32    `json:"score"`
	Vehicle         ReqVehicle `json:"vehicle"`
}

// ReqVehicle struct
type ReqVehicle struct {
	Box               []int   `json:"box"`
	Score             float32 `json:"score"`
	Type              string  `json:"type"`
	VehicleCropBase64 string  `json:"vehicle_crop_base64"`
}

// NewVehicle function
func NewVehicle(opts ...Option) Vehicle {
	var m DefaultVehicle
	m.Init(opts...)

	return &m
}

// NewALPR function
func NewALPR(msg []byte) (m ALPR, err error) {
	defer func() {
		if err != nil {
			log.Errorf("Decode ALPR failure! err=[%s]", err.Error())
		}
	}()

	err = json.Unmarshal(msg, &m)

	return
}

// Init function
func (da *DefaultVehicle) Init(opts ...Option) (err error) {
	err = Init(da, opts...)

	return
}

// Options function
func (da *DefaultVehicle) Options() Options {
	return da.opts
}

// OptionsPointer function
func (da *DefaultVehicle) OptionsPointer() *Options {
	return &da.opts
}

// FromRequest function
func (da *DefaultVehicle) FromRequest(req interface{}) {
	r := req.(Result)

	da.Init(
		Plate(r.Plate),
		PlateScore(r.Score),
		PlateBox(r.Box),
		PlateImage(r.PlateCropBase64),
		Region(r.Region),
		RegionScore(r.RegionScore),
		RegionBox(r.RegionBox),
		RegionImage(r.RegionBase64),
		VehicleScore(r.Vehicle.Score),
		VehicleBox(r.Vehicle.Box),
		VehicleType(r.Vehicle.Type),
		VehicleImage(r.Vehicle.VehicleCropBase64),
	)
}

// Write function
func (da *DefaultVehicle) Write() error {
	b, _ := da.MarshalJSON()
	var data interface{}
	_ = json.Unmarshal(b, &data)
	rst, err := db.Connection.Create(StoreName, data)
	da.opts.ID = rst.InsertedID

	return err
}

// List function
func (da *DefaultVehicle) List(f LpFilter) (interface{}, error) {
	var data []map[string]interface{}
	opt := f.Get()
	coll := db.Connection.Database(db.Config.Database).Collection(StoreName)
	rsp, err := pagination.New(coll).Limit(opt["size"].(int64)).Page(opt["page"].(int64)).Sort("created_at", -1).Filter(opt["filter"]).Find(&data)
	if err != nil {
		fmt.Print(opt)
		return nil, err
	}
	return rsp, nil
}

// MarshalJSON function
func (da DefaultVehicle) MarshalJSON() (b []byte, err error) {
	data := map[string]interface{}{}

	opts := da.Options()
	typ := reflect.TypeOf(opts)
	val := reflect.ValueOf(opts)
	for i := 0; i < typ.NumField(); i++ {
		fld := typ.Field(i)
		tag := fld.Tag.Get("json")

		// Skip if tag is undefined or ignored
		if tag == "" || tag == "-" {
			continue
		}

		idx := strings.IndexRune(tag, ',')
		if idx >= 0 {
			tag = tag[:idx]
		}

		fldVal := val.Field(i)

		var inf interface{}
		switch fldVal.Interface().(type) {
		case image.Image:
			// TODO: save image as file and return file path
			inf, err = mcommon.Img.ToBase64(fldVal.Interface().(image.Image))
		case time.Time:
			inf = fldVal.Interface().(time.Time).Format(time.RFC3339)
		case time.Duration:
			inf = fldVal.Interface().(time.Duration).Seconds()
		default:
			inf = fldVal.Interface()
		}

		data[tag] = inf
	}

	b, err = json.Marshal(data)

	return
}

// UnmarshalJSON function
func (da *DefaultVehicle) UnmarshalJSON(b []byte) (err error) {
	var data map[string]interface{}
	err = json.Unmarshal(b, &data)

	opts := da.OptionsPointer()
	typ := reflect.TypeOf(opts).Elem()
	val := reflect.ValueOf(opts).Elem()
	for i := 0; i < typ.NumField(); i++ {
		fld := typ.Field(i)
		tag := fld.Tag.Get("json")

		// Skip if tag is undefined or ignored
		if tag == "" || tag == "-" {
			continue
		}

		idx := strings.IndexRune(tag, ',')
		if idx >= 0 {
			tag = tag[:idx]
		}

		fldVal := val.Field(i)
		var fldValNew reflect.Value

		value := data[tag]
		if value == nil {
			continue
		}

		switch fldVal.Type().String() {
		case "image.Image":
			// TODO: read file path to image.Image object
			var img image.Image
			if img, _, err = mcommon.Img.FromBase64(value.(string)); err != nil {
				continue
			}
			fldValNew = reflect.ValueOf(img)
		case "time.Time":
			var tm time.Time
			if tm, err = time.Parse(time.RFC3339, value.(string)); err != nil {
				continue
			}
			fldValNew = reflect.ValueOf(tm)
		case "time.Duration":
			fldValNew = reflect.ValueOf(time.Duration(value.(float64)*1000) * time.Millisecond)
		case "[]string":
			arrInf := value.([]interface{})
			arr := make([]string, len(arrInf))
			for i := 0; i < len(arrInf); i++ {
				arr[i] = arrInf[i].(string)
			}
			fldValNew = reflect.ValueOf(arr)
		case "[]int":
			arrInf := value.([]interface{})
			arr := make([]int, len(arrInf))
			for i := 0; i < len(arrInf); i++ {
				arr[i] = int(arrInf[i].(float64))
			}
			fldValNew = reflect.ValueOf(arr)
		case "[]float32":
			arrInf := value.([]interface{})
			arr := make([]float32, len(arrInf))
			for i := 0; i < len(arrInf); i++ {
				arr[i] = float32(arrInf[i].(float64))
			}
			fldValNew = reflect.ValueOf(arr)
		case "int", "int32":
			fldValNew = reflect.ValueOf(int(value.(float64)))
		case "float32":
			fldValNew = reflect.ValueOf(float32(value.(float64)))
		default:
			fldValNew = reflect.ValueOf(value)
		}

		if !fldValNew.IsValid() {
			continue
		}

		fldVal.Set(fldValNew)
	}

	return
}
