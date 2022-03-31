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
	: # We have a config, assuming it's good
else
	echo "Configuring .env"
	read -p "Cardano network (mainnet/testnet):" CARDANO_NETWORK
	read -p "VM API token:" VM_API_TOKEN
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
	echo "KOIOS_URL=${KOIOS_URL}" > ${__repo}/.env
	echo "VM_URL=${VM_URL}" >> ${__repo}/.env
	echo "VM_API_TOKEN=${VM_API_TOKEN}" >> ${__repo}/.env
fi

if [[ $(lsb_release -si) == Ubuntu ]]; then
	if dpkg -L python3.8-venv >/dev/null 2>&1; then
		: # We have venv
	else
		sudo apt-get update && sudo apt-get install -y python3.8-venv
	fi
fi

set -e
python3 -m venv ${__repo}/.venv
. ${__repo}/.venv/bin/activate
pip install ansible==5.1.0 docker requests
ansible-galaxy install -r ${__repo}/ansible/requirements.yml
ansible-playbook ${__repo}/ansible/local.yml -e REPO=${__repo} --diff -c local --inventory 127.0.0.1, -e ansible_python_interpreter=${__repo}/.venv/bin/python3
