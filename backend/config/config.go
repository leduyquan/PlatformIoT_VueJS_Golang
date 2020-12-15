package config

import (
	"github.com/micro/go-micro/v2/config/reader"

	"gitlab.com/brazncorp/util/config"
	"gitlab.com/brazncorp/util/config/database"
)

// Config structure
type Config struct{}

func init() {
	config.Init(NewConfig())
}

// NewConfig function
func NewConfig() *Config {
	return nil
}

// Database function
func (s *Config) Database(value reader.Value) {
	database.Refresh(value)
}
