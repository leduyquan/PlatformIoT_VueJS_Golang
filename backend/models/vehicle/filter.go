package vehicle

import (
	"gitlab.com/brazncorp/util/zero"
	"go.mongodb.org/mongo-driver/bson"
)

type LpFilter struct {
	Page int64 `json:"page" form:"page"`
	Size int64 `json:"size" form:"size"`
}

func (fltr *LpFilter) Get() map[string]interface{} {
	var page int64 = 1
	var size int64 = 10

	setElements := bson.D{}

	if !zero.IsZero(fltr.Page) {
		page = fltr.Page
	}

	if !zero.IsZero(fltr.Size) {
		size = fltr.Size
	}

	var data = map[string]interface{}{
		"page":   page,
		"size":   size,
		"filter": setElements,
	}

	return data
}
