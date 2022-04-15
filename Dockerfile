FROM node:16 AS base
WORKDIR /app

FROM base AS builder
COPY . .

RUN npm run build
RUN npm run build-client
ENTRYPOINT ["/app/docker-entrypoint.sh"]
