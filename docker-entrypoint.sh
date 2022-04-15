#!/usr/bin/env bash

__app=$(cd $(dirname ${BASH_SOURCE[0]}); pwd -P)

# Write out our network configuration
mkdir -p ${__app}/client/build && echo ${CARDANO_NETWORK:-testnet} > ${__app}/client/build/network

# Check for arguments
# No arguments passed or first argument begins with dash
if [[ ${#} -eq 0 ]] || [[ ${1#-} != ${1} ]]; then
	set -- npm run start "${@}"
fi

exec "${@}"
