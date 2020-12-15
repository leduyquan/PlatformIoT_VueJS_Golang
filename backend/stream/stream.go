package stream

import (
	"io"

	"github.com/gin-gonic/gin"
	"github.com/golang/protobuf/proto"
	"github.com/micro/go-micro/v2/broker"
	bproto "github.com/micro/go-micro/v2/broker/service/proto"
	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"
)

// StartServer function
func StartServer(r *gin.Engine) {
	if err := broker.Connect(); err != nil {
		log.Errorf("Connect to broker failure!: err=[%s]", err.Error())
	}

	br := NewStreamer()
	r.GET("/stream", br.Subscribe)
	topic := config.Get("agent", "topic_stream").String("")
	go br.Process(topic)
}

// Streamer struct
type Streamer struct {
	Notifier    chan []byte
	register    chan chan []byte
	disregister chan chan []byte
	clients     map[chan []byte]bool
}

// NewStreamer function
func NewStreamer() (s *Streamer) {
	s = &Streamer{
		Notifier:    make(chan []byte, 1),
		register:    make(chan chan []byte),
		disregister: make(chan chan []byte),
		clients:     make(map[chan []byte]bool),
	}

	go s.listen()

	return
}

func (b *Streamer) listen() {
	for {
		select {
		case s := <-b.register:
			b.clients[s] = true
			log.Infof("Client connected: cli_cnt=[%d]", len(b.clients))
		case s := <-b.disregister:
			delete(b.clients, s)
			log.Infof("Client disconnected: cli_cnt=[%d]", len(b.clients))
		case event := <-b.Notifier:
			for msgChan := range b.clients {
				msgChan <- event
			}
		}
	}
}

// Subscribe function
func (b *Streamer) Subscribe(c *gin.Context) {
	data := make(chan []byte)
	b.register <- data

	defer func() {
		b.disregister <- data
	}()

	notify := c.Request.Context().Done()
	go func() {
		<-notify
		b.disregister <- data
	}()

	c.Stream(func(w io.Writer) (success bool) {
		if msg, ok := <-data; ok {
			c.SSEvent("message", msg)
			log.Debugf("Push data to subscriber: [%s]", msg)

			success = true
		}

		return
	})
}

// Process function
func (b *Streamer) Process(topic string) (err error) {
	_, err = broker.Subscribe(topic, func(p broker.Event) (err error) {
		var data bproto.Message
		if err = proto.Unmarshal(p.Message().Body, &data); err != nil {
			return
		}

		b.Notifier <- data.Body
		log.Debugf("Data comes in: msg=[%s]", data.Body)

		return
	})

	if err != nil {
		log.Errorf("Subscribe failure!: err=[%s] topic=[%s]", err.Error(), topic)
	}

	return
}
