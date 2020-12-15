// Code generated for package template by go-bindata DO NOT EDIT. (@generated)
// sources:
// ../frontend/dist/favicon.ico
// ../frontend/dist/index.html
// ../frontend/dist/robots.txt
package template

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"net/http"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func bindataRead(data []byte, name string) ([]byte, error) {
	gz, err := gzip.NewReader(bytes.NewBuffer(data))
	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}

	var buf bytes.Buffer
	_, err = io.Copy(&buf, gz)
	clErr := gz.Close()

	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}
	if clErr != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

type asset struct {
	bytes []byte
	info  os.FileInfo
}

type bindataFileInfo struct {
	name    string
	size    int64
	mode    os.FileMode
	modTime time.Time
}

// Name return file name
func (fi bindataFileInfo) Name() string {
	return fi.name
}

// Size return file size
func (fi bindataFileInfo) Size() int64 {
	return fi.size
}

// Mode return file mode
func (fi bindataFileInfo) Mode() os.FileMode {
	return fi.mode
}

// Mode return file modify time
func (fi bindataFileInfo) ModTime() time.Time {
	return fi.modTime
}

// IsDir return file whether a directory
func (fi bindataFileInfo) IsDir() bool {
	return fi.mode&os.ModeDir != 0
}

// Sys return file is sys mode
func (fi bindataFileInfo) Sys() interface{} {
	return nil
}


type assetFile struct {
	*bytes.Reader
	name            string
	childInfos      []os.FileInfo
	childInfoOffset int
}

type assetOperator struct{}

// Open implement http.FileSystem interface
func (f *assetOperator) Open(name string) (http.File, error) {
	var err error
	if len(name) > 0 && name[0] == '/' {
		name = name[1:]
	}
	content, err := Asset(name)
	if err == nil {
		return &assetFile{name: name, Reader: bytes.NewReader(content)}, nil
	}
	children, err := AssetDir(name)
	if err == nil {
		childInfos := make([]os.FileInfo, 0, len(children))
		for _, child := range children {
			childPath := filepath.Join(name, child)
			info, errInfo := AssetInfo(filepath.Join(name, child))
			if errInfo == nil {
				childInfos = append(childInfos, info)
			} else {
				childInfos = append(childInfos, newDirFileInfo(childPath))
			}
		}
		return &assetFile{name: name, childInfos: childInfos}, nil
	} else {
		// If the error is not found, return an error that will
		// result in a 404 error. Otherwise the server returns
		// a 500 error for files not found.
		if strings.Contains(err.Error(), "not found") {
			return nil, os.ErrNotExist
		}
		return nil, err
	}
}

// Close no need do anything
func (f *assetFile) Close() error {
	return nil
}

// Readdir read dir's children file info
func (f *assetFile) Readdir(count int) ([]os.FileInfo, error) {
	if len(f.childInfos) == 0 {
		return nil, os.ErrNotExist
	}
	if count <= 0 {
		return f.childInfos, nil
	}
	if f.childInfoOffset+count > len(f.childInfos) {
		count = len(f.childInfos) - f.childInfoOffset
	}
	offset := f.childInfoOffset
	f.childInfoOffset += count
	return f.childInfos[offset : offset+count], nil
}

// Stat read file info from asset item
func (f *assetFile) Stat() (os.FileInfo, error) {
	if len(f.childInfos) != 0 {
		return newDirFileInfo(f.name), nil
	}
	return AssetInfo(f.name)
}

// newDirFileInfo return default dir file info
func newDirFileInfo(name string) os.FileInfo {
	return &bindataFileInfo{
		name:    name,
		size:    0,
		mode:    os.FileMode(2147484068), // equal os.FileMode(0644)|os.ModeDir
		modTime: time.Time{}}
}

// AssetFile return a http.FileSystem instance that data backend by asset
func AssetFile() http.FileSystem {
	return &assetOperator{}
}

var _faviconIco = []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\x62\x60\x60\x64\x60\x62\x10\x10\x00\xd1\x0a\x0c\x19\x2c\x0c\x0c\x6a\x0c\x0c\x0c\x0a\x0a\x10\xfe\x0a\x01\x06\x86\x3e\x16\x06\x06\x0d\x06\x06\x06\x01\x90\x38\x03\x44\x1c\x0c\x58\x18\x06\x1d\x98\x9c\x2d\xf9\x1f\x19\x87\x58\x31\x93\x84\xd1\xf5\x93\x6a\x06\x2d\xf4\x77\x26\x8b\x5d\xa0\x44\x3f\x29\x6e\xa0\x95\x7e\x62\xcd\xa0\x34\xfe\xb7\x6f\x16\xfa\x8f\x0f\x77\x35\x88\xa2\x60\x7a\xeb\x9f\xd0\x2e\xfa\x81\x12\xfd\xe8\x6e\xa0\xb6\x7e\x4a\xc1\xff\xff\x10\x4c\x48\x0d\x03\x3f\x26\x06\x89\x6b\x40\xcb\x18\x07\xe4\x72\x46\x80\xda\xae\x1c\x05\x94\x02\x7c\xf9\x1c\x84\xcb\x42\xf8\xcf\x91\x5a\xf6\x52\x5a\x4e\x52\x5a\xf6\x0f\x37\xfb\x69\xe9\x86\xa1\x62\x3f\xad\xdc\x30\x94\xec\x27\xa5\xfd\x40\x0b\xfb\x69\x11\x06\x43\xcd\x7e\x6a\xbb\x61\x28\xda\x4f\x4d\x37\x0c\x55\xfb\x27\x65\x49\xbe\xa1\x86\xfd\x03\x5d\xff\x13\xd3\xce\x24\xb6\x0d\x8d\x0b\xd3\xca\x7e\x62\xdd\x30\x9c\xed\xdf\xb6\x49\xe8\xd9\x40\xda\x4f\x4c\x18\xd0\xda\x7e\xf4\xbe\x18\xbd\xed\x27\x14\x06\x23\xc1\x7e\x7c\x6e\x18\x29\xf6\xe3\x72\x03\x3e\xfb\x47\x3a\xf8\x8f\x04\x28\x35\x87\x81\x81\xa1\x9e\x58\x0c\xb3\x13\x10\x00\x00\xff\xff\x11\xfd\xa3\x1f\x36\x15\x00\x00")

func faviconIcoBytes() ([]byte, error) {
	return bindataRead(
		_faviconIco,
		"favicon.ico",
	)
}

func faviconIco() (*asset, error) {
	bytes, err := faviconIcoBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "favicon.ico", size: 5430, mode: os.FileMode(436), modTime: time.Unix(1607570283, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _indexHtml = []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\x9c\x93\x6f\x6f\xd3\x30\x10\xc6\xbf\x4a\xc8\xdb\x91\xba\x13\xbc\x98\x90\x1d\xd4\x8d\x52\x15\x89\xae\xb0\x22\x01\xef\x5c\xfb\x92\x5c\xeb\xd8\x9e\xef\x92\x52\x89\x0f\x8f\x42\xc7\x9f\x6e\x65\x08\xde\x44\xba\xd3\xf3\x7b\xee\xc9\xd9\x96\x4f\x5e\x5d\x5f\xad\x3e\x2d\xa7\x59\xc3\xad\x2b\xe5\xf0\xcd\x9c\xf6\xb5\x02\x5f\xca\x06\xb4\x2d\x65\x0b\xac\x33\xd3\xe8\x44\xc0\xaa\xe3\xaa\xb8\xb8\xeb\x35\xcc\xb1\x80\xdb\x0e\x7b\xf5\xb1\xf8\x30\x29\xae\x42\x1b\x35\xe3\xda\x41\x66\x82\x67\xf0\xac\xf2\xf9\x54\x81\xad\x21\xbf\x43\xbc\x6e\x41\xf5\x08\xbb\x18\x12\xff\x52\xed\xd0\x72\xa3\x2c\xf4\x68\xa0\xf8\x5e\x3c\x45\x8f\x8c\xda\x15\x64\xb4\x03\x75\x7e\x64\x60\x28\x55\x05\x87\x2d\xf8\x9f\x16\x8b\xd9\x7c\xbb\xc6\xc9\x97\x65\xb7\x99\xed\xcc\xee\xdd\x74\xba\xb8\x9c\xa5\xe5\xcd\x74\x71\x71\x7b\x59\xed\xc7\xcf\xc7\xfc\x79\xfc\xfa\xcd\xb3\x52\x32\xb2\x83\x72\x52\x83\x67\x29\x0e\x85\x74\xe8\xb7\x59\x93\xa0\x52\x42\x13\x01\x93\x30\x44\x22\xba\xae\x46\x4f\x02\x1c\xb4\xe0\xb9\xe8\x70\x64\x88\xb2\x04\x4e\x11\xef\x1d\x50\x03\xc0\x7f\x82\x75\x8c\x7f\x51\xe7\xc3\xfe\xe8\x85\x10\x55\xf0\x4c\xa3\x3a\x84\xda\x81\x8e\x48\x23\x13\xda\xc1\xe3\x65\xa5\x5b\x74\x7b\xf5\x56\x33\x24\xd4\xee\x6c\x6e\x82\xa7\xaf\xc7\xe5\xd9\x75\xc7\x0e\x3d\xd8\xfb\xfd\xd5\x2e\x9c\xad\x82\x87\xfb\xfd\xf7\xa1\xf3\x0f\xc4\x37\x8d\x4e\x31\xff\x8f\x5f\x8b\x09\x5c\xd0\x36\xd3\x74\x00\x4f\x31\x9b\x03\xb2\xee\xbc\x75\x30\xda\x3c\x04\x4d\xc2\x78\x72\xda\x86\x84\x69\x3a\xbf\x2d\x7a\xf0\x36\x24\xfa\x27\xf8\xb1\x53\x10\x87\xab\xbd\x0e\x76\x9f\x19\xa7\x89\x54\xee\x42\x8d\xbe\x58\xd7\x59\x53\x9c\x8f\xc7\x79\x29\x2d\xf6\x19\x5a\xa5\x63\x2c\xa5\xb0\xd8\x97\xf2\x30\x2b\xa3\x64\x1e\x4b\x58\x4a\xf1\x23\xd4\x69\xe0\x68\x19\xbf\xa9\xc5\x10\x67\xc8\x36\x3c\xc5\x6f\x01\x00\x00\xff\xff\x64\x3a\x9a\x76\x9a\x03\x00\x00")

func indexHtmlBytes() ([]byte, error) {
	return bindataRead(
		_indexHtml,
		"index.html",
	)
}

func indexHtml() (*asset, error) {
	bytes, err := indexHtmlBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "index.html", size: 922, mode: os.FileMode(436), modTime: time.Unix(1607570283, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _robotsTxt = []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\x0a\x2d\x4e\x2d\xd2\x4d\x4c\x4f\xcd\x2b\xb1\x52\xd0\xe2\x72\xc9\x2c\x4e\xcc\xc9\xc9\x2f\xb7\xe2\x02\x04\x00\x00\xff\xff\xa8\xd6\xf8\xc5\x18\x00\x00\x00")

func robotsTxtBytes() ([]byte, error) {
	return bindataRead(
		_robotsTxt,
		"robots.txt",
	)
}

func robotsTxt() (*asset, error) {
	bytes, err := robotsTxtBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "robots.txt", size: 24, mode: os.FileMode(436), modTime: time.Unix(1607570283, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

// Asset loads and returns the asset for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func Asset(name string) ([]byte, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("Asset %s can't read by error: %v", name, err)
		}
		return a.bytes, nil
	}
	return nil, fmt.Errorf("Asset %s not found", name)
}

// MustAsset is like Asset but panics when Asset would return an error.
// It simplifies safe initialization of global variables.
func MustAsset(name string) []byte {
	a, err := Asset(name)
	if err != nil {
		panic("asset: Asset(" + name + "): " + err.Error())
	}

	return a
}

// AssetInfo loads and returns the asset info for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func AssetInfo(name string) (os.FileInfo, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("AssetInfo %s can't read by error: %v", name, err)
		}
		return a.info, nil
	}
	return nil, fmt.Errorf("AssetInfo %s not found", name)
}

// AssetNames returns the names of the assets.
func AssetNames() []string {
	names := make([]string, 0, len(_bindata))
	for name := range _bindata {
		names = append(names, name)
	}
	return names
}

// _bindata is a table, holding each asset generator, mapped to its name.
var _bindata = map[string]func() (*asset, error){
	"favicon.ico": faviconIco,
	"index.html":  indexHtml,
	"robots.txt":  robotsTxt,
}

// AssetDir returns the file names below a certain
// directory embedded in the file by go-bindata.
// For example if you run go-bindata on data/... and data contains the
// following hierarchy:
//     data/
//       foo.txt
//       img/
//         a.png
//         b.png
// then AssetDir("data") would return []string{"foo.txt", "img"}
// AssetDir("data/img") would return []string{"a.png", "b.png"}
// AssetDir("foo.txt") and AssetDir("notexist") would return an error
// AssetDir("") will return []string{"data"}.
func AssetDir(name string) ([]string, error) {
	node := _bintree
	if len(name) != 0 {
		cannonicalName := strings.Replace(name, "\\", "/", -1)
		pathList := strings.Split(cannonicalName, "/")
		for _, p := range pathList {
			node = node.Children[p]
			if node == nil {
				return nil, fmt.Errorf("Asset %s not found", name)
			}
		}
	}
	if node.Func != nil {
		return nil, fmt.Errorf("Asset %s not found", name)
	}
	rv := make([]string, 0, len(node.Children))
	for childName := range node.Children {
		rv = append(rv, childName)
	}
	return rv, nil
}

type bintree struct {
	Func     func() (*asset, error)
	Children map[string]*bintree
}

var _bintree = &bintree{nil, map[string]*bintree{
	"favicon.ico": &bintree{faviconIco, map[string]*bintree{}},
	"index.html":  &bintree{indexHtml, map[string]*bintree{}},
	"robots.txt":  &bintree{robotsTxt, map[string]*bintree{}},
}}

// RestoreAsset restores an asset under the given directory
func RestoreAsset(dir, name string) error {
	data, err := Asset(name)
	if err != nil {
		return err
	}
	info, err := AssetInfo(name)
	if err != nil {
		return err
	}
	err = os.MkdirAll(_filePath(dir, filepath.Dir(name)), os.FileMode(0755))
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(_filePath(dir, name), data, info.Mode())
	if err != nil {
		return err
	}
	err = os.Chtimes(_filePath(dir, name), info.ModTime(), info.ModTime())
	if err != nil {
		return err
	}
	return nil
}

// RestoreAssets restores an asset under the given directory recursively
func RestoreAssets(dir, name string) error {
	children, err := AssetDir(name)
	// File
	if err != nil {
		return RestoreAsset(dir, name)
	}
	// Dir
	for _, child := range children {
		err = RestoreAssets(dir, filepath.Join(name, child))
		if err != nil {
			return err
		}
	}
	return nil
}

func _filePath(dir, name string) string {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	return filepath.Join(append([]string{dir}, strings.Split(cannonicalName, "/")...)...)
}
