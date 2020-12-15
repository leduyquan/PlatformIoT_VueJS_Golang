package services

import (
	"bytes"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	log "github.com/micro/go-micro/v2/logger"
)

const (
	SUCCESS                  = 200
	ERROR                    = 500
	InvalidParams            = 400
	ErrorUnprocessableEntity = 422

	ErrorGetFailed             = 10001
	ErrorUpdateFailed          = 10002
	ErrorCreateFailed          = 10003
	ErrorAuthCheckTokenFail    = 20001
	ErrorAuthCheckTokenTimeout = 20002
	ErrorAuthToken             = 20003
	ErrorAuth                  = 20004
)

var MsgFlags = map[int]string{
	SUCCESS:                    "OK",
	ERROR:                      "Failure!",
	InvalidParams:              "Invalid Param",
	ErrorGetFailed:             "Get resource failed",
	ErrorUpdateFailed:          "Update resource failed",
	ErrorCreateFailed:          "Create resource failed",
	ErrorAuthCheckTokenFail:    "Token authentication failed",
	ErrorAuthCheckTokenTimeout: "Token has timed out",
	ErrorAuthToken:             "Token generation failed",
	ErrorAuth:                  "Token error",
	ErrorUnprocessableEntity:   "Unprocessable Entity",
}

func GetMsg(code int) string {
	msg, ok := MsgFlags[code]
	if ok {
		return msg
	}

	return MsgFlags[ERROR]
}

// Res struct
type Res struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

// Respond function
func Respond(C *gin.Context, httpCode, errCode int, data ...interface{}) {
	rsp := Res{
		Code: errCode,
		Msg:  GetMsg(errCode),
		Data: data,
	}
	if len(data) > 0 {
		rsp.Data = data[0]
	}
	C.JSON(httpCode, rsp)

	return
}

// HandleError function
func HandleError(err error, c *gin.Context, body io.Reader) {
	if err != nil {
		var b bytes.Buffer
		b.ReadFrom(body)
		log.Errorf("Endpoint handles failure!: err=[%s] url=[%s], req=[%s]", err.Error(), c.FullPath(), b.String())
		Respond(c, http.StatusInternalServerError, ERROR)
	}
}

func Contains(a []string, x string) bool {
	for _, n := range a {
		if x == n {
			return true
		}
	}
	return false
}
