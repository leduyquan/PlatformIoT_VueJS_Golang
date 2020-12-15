package common

import (
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/bsontype"
)

// CustomTime takes responsibility to parse string of time in layout "2006-01-02 15:04:05"
type CustomTime struct {
	time.Time
}

// UnmarshalJSON handles how to parse the time by custom layout
func (ct *CustomTime) UnmarshalJSON(input []byte) (err error) {
	strInput := string(input)
	strInput = strings.Trim(strInput, `"`)
	var newTime time.Time
	if newTime, err = time.Parse("2006-01-02 15:04:05", strInput); nil != err {
		return
	}
	ct.Time = newTime

	return
}

// MarshalBSONValue handles how to parse to bson object
func (ct CustomTime) MarshalBSONValue() (bsontype.Type, []byte, error) {
	return bson.MarshalValue(ct.Time)
}
