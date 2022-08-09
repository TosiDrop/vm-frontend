# vm-frontend

Welcome to the Tosidrop VM Frontend!

## About
The code is split into two projects, an Express API which serves as a backend
for the frontend, and a React UI which is built into static assets.

This is intended for use via Docker.

Within this repository is an Ansible playbook to install Docker on the local
machine and run the containers. You can disable installing Docker by setting
`MANAGE_DOCKER=false` in `.env`.

## Usage

```bash
./runme.sh
```

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
KOIOS_URL=https://api.koios.rest/api/v0
VM_URL=https://vm.adaseal.eu
```
