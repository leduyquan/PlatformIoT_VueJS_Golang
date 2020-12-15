package services

import (
	"fmt"
	"os/exec"
	"strings"
)

// Command interface
type Command interface {
	Exec(name string, args map[string]string) (rst bool, err error)
}

// LinuxCommand struct
type LinuxCommand struct {
}

// Exec function
func (lc LinuxCommand) Exec(command string, conf map[string]string) (rst bool, err error) {
	cmdStr := conf["cmd_"+command]
	for k, v := range conf {
		cmdStr = strings.ReplaceAll(cmdStr, "%"+k, v)
	}

	args := strings.Split(cmdStr, " ")
	cmd := exec.Command(args[0], args[1:]...)
	if _, err = cmd.CombinedOutput(); err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			err = fmt.Errorf("command finished with non-zero: %v", exitErr)
		} else {
			err = fmt.Errorf("failed to run command: %v", err)
		}

		return
	}

	rst = true

	return
}
