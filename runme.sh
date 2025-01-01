#!/usr/bin/env bash

__repo=$(cd $(dirname ${BASH_SOURCE[0]}); pwd -P)

VM_BRANCH=${VM_BRANCH:-master}

###
# Check for .env
cd ${__repo}
if test -e ${__repo}/.env; then
    . ${__repo}/.env # source our config
else
    echo "Configuring .env"
    read -p "Cardano network [mainnet|preview]: " CARDANO_NETWORK
    read -p "VM API token: " VM_API_TOKEN
    read -p "Cloudflare Pre-Shared Key (optional): " CLOUDFLARE_PSK
    read -p "DataDog API key (optional): " DD_API_KEY
    if test -z "${CARDANO_NETWORK}"; then
        CARDANO_NETWORK=preview
    fi
    if test -z "${VM_API_TOKEN}"; then
        echo "You must give an API token!"
        exit 1
    fi
    KOIOS_URL=https://preview.koios.rest/api/v0
    VM_URL=https://vmprev.adaseal.eu
    if test "${CARDANO_NETWORK}" == "mainnet"; then
        KOIOS_URL=https://koios.rest/api/v0
        VM_URL=https://vm.adaseal.eu
    fi
    echo "VM_BRANCH=${VM_BRANCH}" > ${__repo}/.env
    echo "CARDANO_NETWORK=${CARDANO_NETWORK}" >> ${__repo}/.env
    echo "KOIOS_URL=${KOIOS_URL}" >> ${__repo}/.env
    echo "VM_URL=${VM_URL}" >> ${__repo}/.env
    echo "VM_API_TOKEN=${VM_API_TOKEN}" >> ${__repo}/.env
    if test -n "${CLOUDFLARE_PSK}"; then
        echo "CLOUDFLARE_PSK=${CLOUDFLARE_PSK}" >> ${__repo}/.env
    fi
    if test -n "${DD_API_KEY}"; then
        echo "DD_API_KEY=${DD_API_KEY}" >> ${__repo}/.env
    fi
    . ${__repo}/.env # source our config
fi

###
# Check for updates
cd ${__repo}
git fetch --tags origin && git merge --no-ff origin/${VM_BRANCH} || {
    echo "Could not merge updates. Please resolve conflicts manually."
    exit 1
}

# Install python3.12-venv if not installed
if [[ $(type -P dpkg) ]]; then
    if dpkg -L python3.12-venv >/dev/null 2>&1; then
        echo "Package python3.12-venv found"
    else
        echo "Installing python3.12-venv"
        sudo apt-get update && sudo apt-get install -y python3.12-venv
    fi
fi

# Create or recreate the virtual environment
rm -rf ${__repo}/.venv
python3.12 -m venv ${__repo}/.venv
if [[ $? -ne 0 ]]; then
    echo "Cannot create Python virtualenv! Ensure python3.12-venv is installed."
    exit 1
fi

# From here on out, bail on failure
set -e
. ${__repo}/.venv/bin/activate

# Upgrade pip to the latest version
pip install --upgrade pip

# Install the latest version of Ansible and other dependencies
pip install ansible docker requests

# Verify the installed versions
echo "Python version: $(python --version)"
echo "Ansible version: $(ansible --version)"

# Run Ansible Galaxy and the playbook
ansible-galaxy install -r ${__repo}/ansible/requirements.yml
ansible-playbook ${__repo}/ansible/local.yml \
    -e REPO=${__repo} \
    -e DD_API_KEY=${DD_API_KEY:-changeme} \
    -e DOCKER_USERS=${DOCKER_USERS:-ubuntu} \
    -e MANAGE_DATADOG=${MANAGE_DATADOG:-false} \
    -e MANAGE_DOCKER=${MANAGE_DOCKER:-true} \
    -e vm_frontend_version=${VM_IMAGE_TAG:-${VM_BRANCH}} \
    -e vm_frontend_port=${VM_PORT:-3000} \
    -e ansible_python_interpreter=${__repo}/.venv/bin/python3 \
    --diff \
    -c local \
    --inventory 127.0.0.1, # this trailing comma is required

# Clean up leftover Docker images
set +e
echo "Cleaning up leftover Docker images"
docker images | grep '<none>' | grep 'ghcr.io/tosidrop/vm-frontend' | awk '{print $3}' | xargs docker rmi &>/dev/null

# Exit cleanly
exit 0