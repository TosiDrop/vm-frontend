#!/usr/bin/env bash

__repo=$(cd $(dirname ${BASH_SOURCE[0]}); pwd -P)
VM_BRANCH=${VM_BRANCH:-master}

###
# Check for updates
cd ${__repo}
git fetch origin && git merge --ff-only origin/${VM_BRANCH}

###
# Check for .env
cd ${__repo}
if test -e ${__repo}/.env; then
	. ${__repo}/.env # source our config
else
	echo "Configuring .env"
	read -p "Cardano network (mainnet/testnet): " CARDANO_NETWORK
	read -p "VM API token: " VM_API_TOKEN
	read -p "Cloudflare Pre-Shared Key: " CLOUDFLARE_PSK
	if test -z "${CARDANO_NETWORK}"; then
		CARDANO_NETWORK=testnet
	fi
	if test -z "${VM_API_TOKEN}"; then
		echo "You must give an API token!"
		exit 1
	fi
	KOIOS_URL=https://testnet.koios.rest/api/v0
	VM_URL=https://vmtest.adaseal.eu
	if test "${CARDANO_NETWORK}" == "mainnet"; then
		KOIOS_URL=https://koios.rest/api/v0
		VM_URL=https://vm.adaseal.eu
	fi
	echo "CARDANO_NETWORK=${CARDANO_NETWORK}" > ${__repo}/.env
	echo "KOIOS_URL=${KOIOS_URL}" >> ${__repo}/.env
	echo "VM_URL=${VM_URL}" >> ${__repo}/.env
	echo "VM_API_TOKEN=${VM_API_TOKEN}" >> ${__repo}/.env
	if test -n "${CLOUDFLARE_PSK}"; then
		echo "CLOUDFLARE_PSK=${CLOUDFLARE_PSK}" >> ${__repo}/.env
	fi
	. ${__repo}/.env # source our config
fi

# Install python3-virtualenv on debian-likes
if [[ $(type -P dpkg) ]]; then
	if dpkg -L python3-venv >/dev/null 2>&1; then
		echo "Package python3-venv found"
	else
		echo "Installing python3-venv"
		sudo apt-get update && sudo apt-get install -y python3-venv
	fi
fi

# Create our virtualenv, if needed
python3 -m venv ${__repo}/.venv
if [[ $? -ne 0 ]]; then
	echo "Cannot create Python virtualenv! Ensure virtualenv is available in your python environment"
	exit 1
fi

# From here on out, bail on failure
set -e
. ${__repo}/.venv/bin/activate
pip install ansible==5.1.0 docker requests
ansible-galaxy install -r ${__repo}/ansible/requirements.yml
ansible-playbook ${__repo}/ansible/local.yml \
	-e REPO=${__repo} \
	-e DOCKER_USERS=${DOCKER_USERS:-ubuntu} \
	-e MANAGE_DOCKER=${MANAGE_DOCKER:-true} \
	-e vm_frontend_port=${PORT:-3000} \
	-e ansible_python_interpreter=${__repo}/.venv/bin/python3 \
	--diff \
	-c local \
	--inventory 127.0.0.1, # this trailing comma is required

# Don't fail on errors, we're going to clean container images, there may be none
set +e
# Find images from our repo tagged as <none> (orphaned layers)
echo "Cleaning up leftover Docker images"
docker images | grep '<none>' | grep 'ghcr.io/tosidrop/vm-frontend' | awk '{print $3}' | xargs docker rmi
# Don't exit w/ 1 if above fails
exit 0
