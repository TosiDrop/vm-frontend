#!/usr/bin/env bash

docker run --rm -ti \
	-v $(pwd -P):/code \
	-v $(pwd -P)/.env:/code/server/.env \
	-p 3000:3000 \
	-p 3001:3001 \
	--workdir /code \
	--user $(id -u) \
	--name vm-frontend-shell \
	--entrypoint bash \
	node:18
