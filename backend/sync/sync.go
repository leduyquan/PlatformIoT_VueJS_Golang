package sync

import (
	"time"

	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"

	"gitlab.com/brazncorp/util/cron"
	models "gitlab.com/brazncorp/web-ui/models/dashboard/vehicle"
)

func Run() {
	timer := config.Get("timer").Int(900)
	c := cron.NewCron()
	err := c.Schedule(cron.Schedule{Time: time.Now(), Interval: time.Second * time.Duration(timer)}, cron.Command{
		Name: "Sync Vehicle",
		Func: syncVehicle,
	})

	if err != nil {
		log.Error("[Sync][Vehicle] Make schedule failed!: ", err.Error())
	}
}

func syncVehicle() (err error) {
	var m = new(models.Vehicle)

	_, _ = m.SyncPlates()
	_, _ = m.SyncCategories()
	_, _ = m.SyncRules()

	return
}
