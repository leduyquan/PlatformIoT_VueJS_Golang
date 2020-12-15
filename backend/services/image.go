package services

import (
	"bufio"
	"bytes"
	"encoding/base64"
	"image"
	"image/jpeg"
	"os"
	"path/filepath"
	"strings"
	"time"

	ufile "gitlab.com/brazncorp/util/file"
)

// Image interface
type Image interface {
	FromBase64(string) (image.Image, string, error)
	ToBase64(image.Image, ...int) (string, error)
	Get(string) (image.Image, error)
	Save(image.Image, string) error
	Crop(image.Image, int, int, int, int) image.Image
}

// DefaultImage struct
type DefaultImage struct {
}

// FromBase64 function
func (i DefaultImage) FromBase64(b64 string) (img image.Image, name string, err error) {
	if b64 == "" {
		return
	}

	dec := base64.NewDecoder(base64.StdEncoding, strings.NewReader(b64))
	if img, name, err = image.Decode(dec); err != nil {
		return
	}

	return
}

// ToBase64 function
func (i DefaultImage) ToBase64(img image.Image, quality ...int) (b64 string, err error) {
	if img == nil {
		return
	}

	var opts jpeg.Options
	if len(quality) == 0 || quality[0] <= 0 || quality[0] > 100 {
		opts.Quality = 100
	} else {
		opts.Quality = quality[0]
	}

	var b bytes.Buffer
	w := bufio.NewWriter(&b)
	if err = jpeg.Encode(w, img, &opts); nil != err {
		return
	}

	b64 = base64.StdEncoding.EncodeToString(b.Bytes())

	return
}

// Get function
func (i DefaultImage) Get(srcURL string) (img image.Image, err error) {
	f, err := os.Open(srcURL)
	if err != nil {
		return
	}
	defer f.Close()

	img, _, err = image.Decode(f)
	if err != nil {
		return
	}

	return
}

// Save function
func (i DefaultImage) Save(img image.Image, destPath string) (err error) {
	dir := filepath.Dir(destPath)
	if ufile.CheckOrMkdirAll(dir); err != nil {
		return
	}

	var f *os.File
	if f, err = os.Create(destPath); err != nil {
		return
	}
	defer f.Close()
	f.SetWriteDeadline(time.Now().Add(time.Second * 60))

	err = jpeg.Encode(f, img, &jpeg.Options{Quality: 100})

	return
}

// Crop function
func (i DefaultImage) Crop(img image.Image, width, height, leftX, topY int) (cropped image.Image) {
	rect := image.Rect(leftX, topY, width, height)
	cropped = img.(interface {
		SubImage(r image.Rectangle) image.Image
	}).SubImage(rect)

	return
}
