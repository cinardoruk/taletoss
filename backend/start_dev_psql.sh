#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2025 Çınar Doruk
#
# SPDX-License-Identifier: AGPL-3.0-only

:<<COMMENT
start/stop a docker container for a dev psql
TODO
* task
COMMENT

set -euo pipefail

ENV_FILE=".env.psql"
DC_FILE="docker-compose.psql.yml"

headless() {
	docker compose --env-file "$ENV_FILE" -f "$DC_FILE" up -d
}

normal() {
	docker compose --env-file "$ENV_FILE" -f "$DC_FILE" up
}

stop_contianers() {
	docker compose --env-file "$ENV_FILE" -f "$DC_FILE" stop
}

stop_and_remove(){
	docker compose --env-file "$ENV_FILE" -f "$DC_FILE" down
}

usage(){
	echo """
	Usage: $0 [OPTIONS]

	Options:

	normal 		    start normally
	headless		start with -d
	stop_contianers stop the containers
	stop_and_remove	stop AND remove the containers
	down 			spin down services
	help            Display this help message
	"""
}

main() {
	if [[ $# -eq 0 ]]; then
		usage
		exit 1
	fi
	for arg in "$@"; do
		case $arg in
			normal)
				normal
				;;
			headless)
				headless
				;;
			stop_contianers)
				stop_contianers
				;;
			stop_and_remove)
				stop_and_remove
				;;
			help)
				usage
				;;
			*)
				echo "Error: Unknown option '$arg'"
				usage
				exit 1
				;;
		esac
	done
}

main "$@"
