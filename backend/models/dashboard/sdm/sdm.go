package sdm

import (
	"fmt"

	"github.com/micro/go-micro/v2/config"

	mcommon "gitlab.com/brazncorp/web-ui/models/common"
)

// SDM struct
type SDM struct {
}

// RestartEngine function
func RestartEngine(name string) (err error) {
	args := config.Get("sdm", "services", name).StringMap(nil)
	if args == nil {
		return
	}
	if _, err = mcommon.Cmd.Exec("restart", args); err != nil {
		err = fmt.Errorf("restarting service '%s' error '%s'", name, err.Error())

		return
	}

	return
}
