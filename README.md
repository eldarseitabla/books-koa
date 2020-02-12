# books-koa
Demo project on Koa

## Requirements

- node: >= v12.14.0
- docker compose


## Install

Node modules
```bash
npm i
```

#### Build docker compose services and database
Add environment path to directory for Volumes (If didn't do it)
```bash
echo 'export DOCKER_VOLUMES=$HOME/DockerVolumes' >> ~/.zshrc
# Check
echo $DOCKER_VOLUMES
```

Build, (re)create MySQL in Docker and create database
```bash
docker-compose up -d
```

#### Run seeds
```bash
npm run seeds
```

## Use openAPI
Go
[http://localhost:3000/api](http://localhost:3000/api)

