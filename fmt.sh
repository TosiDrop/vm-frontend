#!/usr/bin/env bash

docker run --rm -ti \
	-v $(pwd -P):/code \
	--workdir /code \
	--user $(id -u) \
	--entrypoint bash \
	node:24 \
	-c 'cd client && npm run format && cd ../server && npx prettier --write .'
