FROM node:16 AS base

FROM base AS builder
WORKDIR /code
COPY . .
RUN cd client && npm run build
RUN cd server && npm run build

FROM base AS final
WORKDIR /app
COPY --from=builder --chmod=555 /code/docker-entrypoint.sh .
COPY --from=builder /code/server/index.ts /code/server/package.json /code/server/tsconfig.json ./
COPY --from=builder /code/server/node_modules ./node_modules/
COPY --from=builder /code/client/src/entities/ ./client/src/entities/
COPY --from=builder /code/client/src/services/ ./client/src/services/
COPY --from=builder /code/client/build/ ./client/build/
ENTRYPOINT ["/app/docker-entrypoint.sh"]
