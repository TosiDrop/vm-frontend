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

### Mainnet
For Mainnet, you'll want to set the following variables to point to a mainnet
instance of the backends. Also, make sure API token (and PSK) matches mainnet.

```
AIRDROP_ENABLED=false
CARDANO_NETWORK=mainnet
KOIOS_URL=https://api.koios.rest/api/v0
VM_URL=https://vm.adaseal.eu
```
