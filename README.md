# vm-frontend

Welcome to the Tosidrop VM Frontend!

## About
The code is split into two projects, an Express API which serves as a backend
for the frontend, and a React UI which is built into static assets.

## Dev usage

Run `npm ci` in the client, server, and root folders to install the locked
dependencies. The preferred development command is `npm run dev` from the
root folder. See the client README for frontend-specific guidance.

The project requires Node.js 22 or newer and npm 9 or newer. The most accurate
runtime results come from the Docker image.

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
