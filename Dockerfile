FROM node:16 AS base
WORKDIR /app

FROM base AS builder
COPY . .

RUN npm run build
RUN npm run build-client
CMD ["npm", "run", "start"]
