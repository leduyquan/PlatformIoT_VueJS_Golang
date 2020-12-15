package background

import (
	"time"

	"github.com/micro/go-micro/v2/broker"
	"github.com/micro/go-micro/v2/broker/nats"
	log "github.com/micro/go-micro/v2/logger"

	mcoll "gitlab.com/brazncorp/web-ui/models/common/collection"
	model "gitlab.com/brazncorp/web-ui/models/vehicle"
)

var (
	address = "127.0.0.1:4222"
	topic   = "brazn.topic.alpr"
)

// Run function
func Run() (err error) {
	var brk broker.Broker
	var sub broker.Subscriber
	var h broker.Handler

	brk = nats.NewBroker()

	defer func() {
		if err != nil {
			log.Errorf("Subscribe failure!: err=[%s] brk_name=[%s] brk_addr=[%s]", err.Error(), brk.String(), address)

			return
		}
		log.Infof("Background done")
		// if err = sub.Unsubscribe(); err != nil {
		// 	return
		// }
		// if err = brk.Disconnect(); err != nil {
		// 	return
		// }
	}()

	for {
		if err = brk.Connect(); err == nil {
			log.Infof("Connect success: brk_name=[%s] brk_addr=[%s]", brk.String(), address)

			break
		}
		log.Errorf("Connect failure! Retrying...: err=[%s] brk_name=[%s] brk_addr=[%s]",
			err.Error(), brk.String(), address)

		time.Sleep(time.Second * 5)
	}

	h = func(e broker.Event) (err error) {
		if err = e.Error(); err != nil {
			return
		}

		if e.Message() == nil {
			log.Warnf("Empty message")
			return
		}

		alpr, _ := model.NewALPR(e.Message().Body)
		var vehs []model.Vehicle
		coll := mcoll.NewCollection()
		coll.Init(
			mcoll.StoreName("alpr_events"),
		)
		for _, rst := range alpr.Results {
			veh := model.NewVehicle(
				model.FileName(alpr.Filename),
				model.ProcessingTime(alpr.ProcessingTime),
				model.Timestamp(alpr.Timestamp),
				model.Collection(coll),
			)
			veh.FromRequest(rst)
			vehs = append(vehs, veh)
		}

		for _, veh := range vehs {
			opt := veh.OptionsPointer()
			_ = opt
			coll := opt.Collection
			_ = coll
			items := coll.OptionsPointer().Items
			_ = items
			err = veh.Write()
			if err != nil {
				log.Errorf("Write to store failed!: err=[%s] data=[%+v]", err.Error(), veh.Options())

				return
			}
			log.Infof("Write to store success: id=[%+v]", veh.Options().ID)
			log.Debugf("Written data: data=[%+v]", veh.Options())
		}

		return
	}

	if sub, err = brk.Subscribe(topic, h); err != nil {
		return
	}

	_ = sub

	return
}
