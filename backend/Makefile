NAME_WEB=go-web
NAME_CLI=go-cli
IMAGE_NAME=brazn/${NAME_WEB}
GIT_COMMIT=${shell git rev-parse --short HEAD}
GIT_TAG=${shell git describe --abbrev=0 --tags --always --match "v*"}
IMAGE_TAG=${GIT_TAG}

build: build_bindata build_osx build_linux build_windows

build_bindata:
	go-bindata -fs -pkg template -o ./bindata/template/template.go -prefix ../frontend/dist/ ../frontend/dist/
	go-bindata -fs -pkg asset -o ./bindata/asset/asset.go -prefix ../frontend/dist/assets/ ../frontend/dist/assets/...

build_osx:
	GOSUMDB=off CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -ldflags "-X main.Mode=release" -o ./bin/${IMAGE_TAG}/osx/${NAME_WEB} ./*.go
	cp -R config.json ./test_resource ./bin/${IMAGE_TAG}/osx
	chmod +x ./bin/${IMAGE_TAG}/osx/${NAME_WEB}

	GOSUMDB=off CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -o ./bin/${IMAGE_TAG}/osx/${NAME_CLI} ./cmd/*.go
	chmod +x ./bin/${IMAGE_TAG}/osx/${NAME_CLI}

build_linux:
	GOSUMDB=off CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -ldflags "-X main.Mode=release" -o ./bin/${IMAGE_TAG}/linux/${NAME_WEB} ./*.go
	cp -R config.json ./test_resource ./bin/${IMAGE_TAG}/linux
	chmod +x ./bin/${IMAGE_TAG}/linux/${NAME_WEB}

	GOSUMDB=off CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ./bin/${IMAGE_TAG}/linux/${NAME_CLI} ./cmd/*.go
	chmod +x ./bin/${IMAGE_TAG}/linux/${NAME_CLI}

build_windows:
	GOSUMDB=off CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -ldflags "-X main.Mode=release" -o ./bin/${IMAGE_TAG}/windows/${NAME_WEB}.exe ./*.go
	cp -R config.json ./test_resource ./bin/${IMAGE_TAG}/windows
	chmod +x ./bin/${IMAGE_TAG}/windows/${NAME_WEB}.exe

	GOSUMDB=off CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o ./bin/${IMAGE_TAG}/windows/${NAME_CLI}.exe ./cmd/*.go
	chmod +x ./bin/${IMAGE_TAG}/windows/${NAME_CLI}.exe

docker:
	docker build --build-arg NAME=$(NAME_WEB) -t $(IMAGE_NAME):$(IMAGE_TAG) .
	docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(IMAGE_NAME)
	docker push $(IMAGE_NAME):$(IMAGE_TAG)
	docker push $(IMAGE_NAME):latest

.PHONY: build_bindata build build_osx build_linux build_windows docker
