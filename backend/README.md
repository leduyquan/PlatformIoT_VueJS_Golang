# Pre-build BinData
install go-bindata:

`go get -u github.com/go-bindata/go-bindata/...`

usage: generate templates

`go-bindata -fs -pkg template -o ./bindata/template/template.go -prefix ../frontend/dist/ ../frontend/dist/`

usage: generate assets

`go-bindata -fs -pkg asset -o ./bindata/asset/asset.go -prefix ../frontend/dist/assets/ ../frontend/dist/assets/...`