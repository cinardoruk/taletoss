#!/usr/bin/env bash
:<<COMMENT
qol wrapper around docker compose for production
TODO
* task
COMMENT

set -euo pipefail

ENV_FILE=".env.prod"
DC_FILE="docker-compose.prod.yml"


run() {
	docker compose --env-file "$ENV_FILE" -f "$DC_FILE" "$@"
}

usage(){
	echo """
Usage: $0 [OPTIONS]

Options:

up 		    start normally
up -d		start with -d
stop 		stop the containers
down		stop AND remove the containers
--build     force build images
help        display this help message
	"""
}

main() {
	if [[ $# -eq 0 ]]; then
		usage
		exit 1
	fi
	for arg in "$@"; do
		case $arg in
			help)
				usage
				;;
			*)
				run "$@"
				exit 1
				;;
		esac
	done
}

main "$@"
