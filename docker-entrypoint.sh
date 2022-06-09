#!/usr/bin/env bash

__app=$(cd $(dirname ${BASH_SOURCE[0]}); pwd -P)

# Check for arguments
# No arguments passed or first argument begins with dash
if [[ ${#} -eq 0 ]] || [[ ${1#-} != ${1} ]]; then
	cd ${__app}/server
	set -- node -r ts-node/register index.ts "${@}"
fi

exec "${@}"
