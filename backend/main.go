package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os/exec"
	"runtime"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"

	"gitlab.com/brazncorp/web-ui/background"
	binasset "gitlab.com/brazncorp/web-ui/bindata/asset"
	bintemplate "gitlab.com/brazncorp/web-ui/bindata/template"
	_ "gitlab.com/brazncorp/web-ui/config"
	"gitlab.com/brazncorp/web-ui/middlewares"
	"gitlab.com/brazncorp/web-ui/routes"
	_ "gitlab.com/brazncorp/web-ui/services/cache"
	"gitlab.com/brazncorp/web-ui/stream"
)

// Mode help for building app
var Mode = gin.DebugMode

func main() {
	gin.SetMode(Mode)
	r := gin.Default()
	r.Use(cors.Default())

	routes.Master.Init(
		routes.WithEngine(r),
	)
	routes.Master.SetupRouters()

	webClient(r)

	//host := config.Get("server", "host").String("localhost")
	port := config.Get("server", "port").Int(80)

	s := &http.Server{
		Addr: fmt.Sprintf(":%d", port),
		Handler: &Middleware{
			Engine: r,
		},
		MaxHeaderBytes: 1 << 20,
	}

	if gin.Mode() == gin.ReleaseMode {
		//TODO: Turn off it when building docker image
		//openbrowser(fmt.Sprintf("http://%s:%d/", host, port))
	}

	stream.StartServer(r)
	background.Run()
	if err := s.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

func webClient(r *gin.Engine) {
	r.Use(middlewares.DefaultPath)
	switch gin.Mode() {
	case gin.DebugMode:
		r.Use(static.Serve("/", static.LocalFile("../frontend/dist", true)))
		r.StaticFS("/file", http.Dir("public"))
		r.NoRoute(func(c *gin.Context) {
			t, _ := ioutil.ReadFile("../frontend/dist/index.html")
			c.Data(http.StatusOK, "text/html; charset=utf-8", t)
		})
	default:
		r.StaticFS("/assets", binasset.AssetFile())
		r.StaticFS("/file", http.Dir("public"))
		r.NoRoute(func(c *gin.Context) {
			t, _ := bintemplate.Asset("index.html")
			c.Data(http.StatusOK, "text/html; charset=utf-8", t)
		})
	}
}

// Middleware struct
type Middleware struct {
	*gin.Engine
}

func (r *Middleware) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	// TODO: preprocess request
	if false {
		req.RequestURI = "/"
		req.URL.Path = "/"
	}
	r.Engine.ServeHTTP(w, req)
}

func openbrowser(url string) {
	var err error

	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		// TODO need to test for windows case
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	if err != nil {
		log.Fatal(err)
	}
}
