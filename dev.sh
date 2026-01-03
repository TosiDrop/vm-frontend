#!/usr/bin/env bash

docker run --rm -ti \
	-v $(pwd -P):/code \
	-v $(pwd -P)/.env:/code/server/.env \
	-p3000:3000 \
	-p3001:3001 \
	--workdir /code \
	--user $(id -u) \
	--name vm-frontend \
	--entrypoint bash \
	node:24 ${@:--c 'npm i && cd server && npm i && cd ../client && npm i && cd .. && npm run dev'}
