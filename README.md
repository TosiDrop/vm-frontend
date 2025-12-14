# vm-frontend

Welcome to the Tosidrop VM Frontend!

## About
The code is split into two projects, an Express API which serves as a backend
for the frontend, and a React UI which is built into static assets.

## Dev usage

You can run `npm install` and `npm run` from the client, server, and root
folders as needed. The preferred way for testing us `npm run dev` from the
root folder. There's a readme on the client folder you should check out.

Project uses NPM version 24. Most accurate results are obtained runnning
the docker image.

### Logging
Access logging is enabled in the server. It uses Morgan and the type of logs
which are output can be controlled by setting `LOG_TYPE` to a valid Morgan
log type, such as `LOG_TYPE=combined` for Apache Combined Log Format.

### Mainnet
For Mainnet, you'll want to set the following variables to point to a mainnet
instance of the backends. Also, make sure API token (and PSK) matches mainnet.

```
AIRDROP_ENABLED=false
CARDANO_NETWORK=mainnet
KOIOS_URL=https://api.koios.rest/api/v1
VM_URL=https://vm.adaseal.eu
```
