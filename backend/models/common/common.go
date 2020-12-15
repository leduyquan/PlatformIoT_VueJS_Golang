package common

import "gitlab.com/brazncorp/web-ui/services"

var (
	Auth = services.NewAuth()
	Cmd  = services.NewCommand()
	Img  = services.NewImage()
	JSON = services.NewJSON()
	Rsp  = services.NewResponse()
)
