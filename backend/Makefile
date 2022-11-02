.PHONY: build clean deploy gomodgen

build: gomodgen
	export GO111MODULE=on
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/socket cmd/socket/main.go
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/loopback cmd/loopback/main.go

	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/participants/create cmd/participants/create/main.go
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/participants/getOne cmd/participants/getOne/main.go

	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/notaries/create cmd/notaries/create/main.go
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/notaries/getOne cmd/notaries/getOne/main.go

	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/orders/create cmd/orders/create/main.go
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/orders/getOne cmd/orders/getOne/main.go
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/orders/getAll cmd/orders/getAll/main.go
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/orders/getByOwner cmd/orders/getByOwner/main.go

clean:
	rm -rf ./bin
	rm -rf ./vendor

# rm -rf go.sum

deploy: clean build
	sls deploy --verbose

gomodgen:
	chmod u+x gomod.sh
	./gomod.sh
