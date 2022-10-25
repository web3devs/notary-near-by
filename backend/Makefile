.PHONY: build clean deploy gomodgen

build: gomodgen
	export GO111MODULE=on
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/hello cmd/hello/main.go
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/socket cmd/socket/main.go
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/loopback cmd/loopback/main.go

clean:
	rm -rf ./bin
	rm -rf ./vendor

# rm -rf go.sum

deploy: clean build
	sls deploy --verbose

gomodgen:
	chmod u+x gomod.sh
	./gomod.sh
