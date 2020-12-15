package main

import (
	"os"

	"github.com/micro/cli/v2"
	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"

	cfg "gitlab.com/brazncorp/util/config"
	"gitlab.com/brazncorp/util/config/database"
	"gitlab.com/brazncorp/web-ui/migrations"
)

func main() {
	cfg.Init(cfg.Config{})
	database.Refresh(config.DefaultConfig.Get("database"))
	app := &cli.App{}
	app.Commands = []*cli.Command{
		{
			Name:  "migration",
			Usage: "Migration db",
			Action: func(c *cli.Context) error {
				migrations.SeedDatabase()
				return nil
			},
		},
	}
	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}

}
