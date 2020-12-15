package migrations

import (
	"fmt"

	log "github.com/micro/go-micro/v2/logger"

	"gitlab.com/brazncorp/web-ui/migrations/module"
	"gitlab.com/brazncorp/web-ui/migrations/module/account"
)

// Seed struct
type Seed struct {
	Name string
	Run  func() error
}

// SeedDatabase function
func SeedDatabase() {
	for _, seed := range registerBindings() {
		fmt.Println("Running seed ", seed.Name)
		if err := seed.Run(); err != nil {
			log.Error("Running seed '%s', failed with error: %s", seed.Name, err)
		}
	}
}

func registerBindings() []Seed {
	return []Seed{
		{
			Name: "Migrate Admin Modules",
			Run: func() error {
				model := &module.Admin{}
				return model.Run()
			},
		},
		{
			Name: "Migrate Systems",
			Run: func() error {
				model := &module.System{}
				return model.Run()
			},
		},
		{
			Name: "Migrate Configuration",
			Run: func() error {
				model := &module.Configuration{}
				return model.Run()
			},
		},
		{
			Name: "Migrate User",
			Run: func() error {
				model := &account.User{}
				model.RunModule()
				return model.Run()
			},
		},
		{
			Name: "Migrate Barrier",
			Run: func() error {
				model := &module.Barrier{}
				return model.Run()
			},
		},
		{
			Name: "Migrate Vehicle",
			Run: func() error {
				model := &module.Vehicle{}
				return model.Run()
			},
		},
	}
}
