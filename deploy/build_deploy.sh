#!/bin/zsh

# SPDX-FileCopyrightText: 2025 Çınar Doruk
#
# SPDX-License-Identifier: AGPL-3.0-only

:<<COMMENT
Optional description of script.
TODO
* auth once with the vps
COMMENT

# example of 'feed local script to remote machine'
# ssh_to_vps "bash -s" < ./ensure_bare_and_hook.sh

# build
# build ng application, outputting to release/angular
# build aspnetcore application, outputting to release/aspnetcore
# copy current nginx.conf into release/nginx
# copy current docker-compose.prod.yml into release
# copy current .env.prod into release
# copy current secrets files/dir into release

# upload

# make sure /var/www/project/ exists
# rsync release dir to remote /var/www/project/

# run
# stop existing docker compose session, prune destroy etc if necessary
# run docker compose up -f docker-compose.prod.yml

set -euo pipefail

# ──────────────────────────────
# Load deployment config
# ──────────────────────────────
CONFIG_FILE="$(dirname "$0")/build_deploy.env"
if [[ -f "$CONFIG_FILE" ]]; then
  source "$CONFIG_FILE"
else
  echo "❌ Missing config: $CONFIG_FILE"
  exit 1
fi

# ──────────────────────────────
# ssh private key in ssh agent
# ──────────────────────────────

start_ssh_agent() {
	echo "▶ Starting SSH agent..."
	eval "$(ssh-agent -s)"

	echo "▶ Unlocking SSH key..."
	ssh-add "$VPS_SSH_KEY_PATH"

	# optional: test that it worked
	ssh -o BatchMode=yes -p "$VPS_SSH_PORT" "$VPS_SSH" 'echo "✅ Connected!"'
}
# ──────────────────────────────
# helper wrappers
# ──────────────────────────────

reset_release_dir() {
	rm -rf "$RELEASE_DIR"
	mkdir  "$RELEASE_DIR"
}

ssh_to_vps(){
	ssh -i $VPS_SSH_KEY_PATH -p $VPS_SSH_PORT $VPS_SSH "$@"
}

rsync_to_vps(){
	local local_dir="$1"
	local remote_user_and_host="$2"
	local remote_dir="$3"

	rsync -avz --info=progress2 --partial --delete \
		-e "ssh -i $VPS_SSH_KEY_PATH -p $VPS_SSH_PORT" \
		"$local_dir" "$remote_user_and_host:$remote_dir"
}


# ──────────────────────────────
# 1. BUILD
# ──────────────────────────────
build() {
  echo "▶ Building Angular…"
  # ( cd "$ANGULAR_DIR" && npm ci && ng build --configuration production --output-path "$RELEASE_DIR/angular/dist" )
  ( cd "$ANGULAR_DIR" && npm ci && ng build --configuration production_demo --output-path "$RELEASE_DIR/angular/dist" )
  # ( cd "$ANGULAR_DIR" && npm ci && ng build --configuration production_test --output-path "$RELEASE_DIR/angular/dist" )

  echo "▶ Publishing ASP.NET Core…"
  ( cd "$ASP_DIR" && dotnet publish -c Release -o "$RELEASE_DIR/aspnetcore" )
}

# ──────────────────────────────
# 2. PACKAGE artefacts into release/
# ──────────────────────────────
package() {
  echo "▶ Staging auxiliary files…"
  mkdir -p "$RELEASE_DIR/nginx"
  cp -v nginx/nginx.conf          "$RELEASE_DIR/nginx/"
  cp -v "$DOCKER_COMPOSE_FILE"    "$RELEASE_DIR/"
  cp -v "$ASP_DOCKERFILE"	  	  "$RELEASE_DIR/aspnetcore/"
  cp -v "dc_start.sh"    		  "$RELEASE_DIR/"
  cp -v "reset_db.sh"    		  "$RELEASE_DIR/"
  cp -v .env.prod                 "$RELEASE_DIR/"
  cp -v -r secrets                "$RELEASE_DIR/"
}

# ──────────────────────────────
# 3. UPLOAD release/ to vps using rsync
# ──────────────────────────────

release_to_vps(){
	ssh_to_vps "mkdir -p $VPS_WORKTREE"

	rsync_to_vps $RELEASE_DIR $VPS_SSH $VPS_WORKTREE

	ssh_to_vps "chmod +x $VPS_WORKTREE/start_dc.sh"

}

# ──────────────────────────────
# 3. START docker compose in vps
# ──────────────────────────────
start_dc(){
	ssh_to_vps "$VPS_WORKTREE/start_dc.sh up --build"
}

usage(){
	echo """
Usage: $0 [OPTIONS]

Options:

build 					build angular and asp.net core application in release/angular, and release/aspnetcore, respectively
package					copy nginx.conf, docker-compose.prod.yml, .env.prod and secrets/ into release/
build_and_package       build and package
release_to_vps			rsync release/ to $VPS_SSH:$VPS_WORKTREE
start_dc				start docker compose on the vps using $DOCKER_COMPOSE_FILE
all  		            Run all steps (build, package, release_to_vps, start_dc)
help        		    Display this help message

fill out the variables in build_deploy.env

WARNING: rsync is used with the --delete option. Local state will replace remote state. e.g files in the remote dir which are not on the local dir will be removed
	"""
}

# ──────────────────────────────
# MAIN  (orchestrate steps)
# ──────────────────────────────
main() {

  for arg in "$@"; do
	  case $arg in
		  build)
			  reset_release_dir
			  build
			  ;;
		  package)
			  package
			  ;;
		  build_and_package)
			  reset_release_dir
			  build
			  package
			  ;;
		  release_to_vps)
			  start_ssh_agent
			  release_to_vps
			  # ssh-agent -k
			  ;;
		  start_dc)
			  start_ssh_agent
			  start_dc
			  # ssh-agent -k
			  ;;
		  all)
			  build
			  package
			  start_ssh_agent
			  release_to_vps
			  start_dc
			  # ssh-agent -k
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
