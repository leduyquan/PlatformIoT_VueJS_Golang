package setting

import (
	"bufio"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"strings"

	"github.com/micro/go-micro/v2/config"
	log "github.com/micro/go-micro/v2/logger"

	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	mfile "gitlab.com/brazncorp/web-ui/models/file"
)

// SettingCamera struct
type SettingCamera struct {
}

// CameraRequest struct
type CameraRequest struct {
	CameraDir string `json:"camera_dir"`
}

// CameraResponse struct
type CameraResponse struct {
	ID                 int    `json:"id,omitempty" bson:"id,omitempty"`
	Name               string `json:"name,omitempty" bson:"name,omitempty"`
	Stream             string `json:"stream,omitempty" bson:"stream,omitempty"`
	DetectionMaskImage string `json:"detection_mask_image,omitempty" bson:"detection_mask_image,omitempty"`
	GstreamerFormat    string `json:"gstreamer_format,omitempty" bson:"gstreamer_format,omitempty"`
}

// Camera struct
type Camera struct {
	ID                 int    `json:"id,omitempty" bson:"id,omitempty"`
	Name               string `json:"name,omitempty" bson:"name,omitempty"`
	Stream             string `json:"stream,omitempty" bson:"stream,omitempty"`
	DetectionMaskImage string `json:"detection_mask_image,omitempty" bson:"detection_mask_image,omitempty"`
	GstreamerFormat    string `json:"gstreamer_format,omitempty" bson:"gstreamer_format,omitempty"`
	// used to transform to ID
	CameraID int `json:"camera_id,string,omitempty" bson:"-"`
}

// Directory function
func (s *SettingCamera) Directory() (p string, err error) {
	if p = config.Get("agent", "camera_dir").String(""); "" == p {
		err = errors.New("Agent config not found")
		log.Errorf("[Setting][Camera] Read config failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return
	}

	return
}

// Read function
func (s *SettingCamera) Read() (rsp []CameraResponse, err error) {
	var p string
	if p = config.Get("agent", "config_path").String(""); "" == p {
		err = errors.New("Agent config not found")
		log.Errorf("[Setting][Camera] Read config failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return
	}

	if _, err = mcommon.JSON.Read(p, &rsp, "agent", "cameras"); nil != err {
		log.Errorf("[Setting][Camera] Read config failed!: msg=[%s], err=[%+v], data=[%s]", err.Error(), err, p)

		return
	}
	log.Debugf("[Setting][Camera] Read config: %+v", rsp)

	return
}

// Fetch function
func (s *SettingCamera) Fetch(req CameraRequest) (rsp []Camera, err error) {
	d := config.Get("agent", "camera_dir").String("")
	if "" == d {
		err = errors.New("Camera directory not found")
		log.Errorf("[Setting][Camera] Fetch failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return
	}

	toUpdateCamDir := false
	if "" != req.CameraDir && d != req.CameraDir {
		toUpdateCamDir = true
		d = req.CameraDir
	}

	if rsp, err = s.fetch(d); nil != err {
		log.Errorf("[Setting][Camera] Fetch failed!: msg=[%s], err=[%+v], data=[%s]", err.Error(), err, d)

		return
	}

	if err = mfile.NewCameraConfig().Save(rsp); nil != err {
		return
	}

	if toUpdateCamDir {
		if err = mfile.NewCameraConfig().SaveDirectory(req.CameraDir); nil != err {
			return
		}
	}

	var m = new(Agent)
	m.Cameras = rsp
	_ = m.Save()

	return
}

func (s *SettingCamera) fetch(dir string) (rsp []Camera, err error) {
	err = filepath.Walk(dir, func(path string, f os.FileInfo, e error) error {
		if nil != e {
			return e
		}
		if filepath.Ext(f.Name()) == ".conf" {
			c, e := s.parse(path)
			if nil != e {
				return e
			}
			if nil != c {
				rsp = append(rsp, *c)
			}
		}

		return nil
	})

	return
}

func (s *SettingCamera) parse(path string) (rsp *Camera, err error) {
	var readFile *os.File
	if readFile, err = os.Open(path); err != nil {
		return
	}
	defer readFile.Close()

	scanner := bufio.NewScanner(readFile)
	scanner.Split(bufio.ScanLines)

	m := map[string]interface{}{}
	for scanner.Scan() {
		ln := scanner.Text()
		kv := strings.Split(ln, "=")
		if 2 > len(kv) {
			continue
		}
		m[strings.TrimSpace(kv[0])] = strings.TrimSpace(kv[1])
		log.Debug("[Setting][Camera] Parse line: ", ln)
	}
	b, _ := json.Marshal(m)
	if err = json.Unmarshal(b, &rsp); nil != err {
		return
	}

	// refine more fields
	n := filepath.Base(readFile.Name())
	rsp.Name = strings.TrimSuffix(n, filepath.Ext(n))
	rsp.ID = rsp.CameraID

	return
}
