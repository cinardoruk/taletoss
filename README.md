# 🎲 TaleToss

A web application for generating random visual prompts to help you create stories.
Click a button to display 5 or 9 random images, then use every one of them to create a story.
Useful for making language students practice speaking.

---

## 📑 Table of Contents
1. [Live Demo](#🌐-live-demo)
2. [Features](#✨-features)
3. [Stack](#🧱-stack)
4. [Development](#🛠️-development)
5. [Deployment](#📦-deployment)
6. [Script Usage](#⚙️-script-usage-help)
7. [Contributing & Contact](#🤝 -contributing-&-Contact)
8. License

---

## 🌐 Live Demo

👉 [Live Demo Here](https://cinardoruk.xyz/demo/taletoss)

---

## ✨ Features

### User
- 🎲 Dynamic story-dice generation (5 or 9 dice)

### Technical
-    Angular SPA
-    ASP.NET Core backend
- 🔐 JWT Bearer authentication & authorization
-    Route guarding on the front end
- ⚙️ Role-based views (student vs. teacher login)
-    Teacher admin view for adding/deleting images
- 🗄️ PostgreSQL persistence for images & sessions
- 🐳 Dockerized setup for easy production runs
-    Bash scripts that build, package, push, run, and manage the entire application

---

## 🧱 Stack

back: .Net 8 ASP.NET Core
front: Angular 17
database: PostgreSQL
reverse proxy: nginx
containerization: docker compose
build & deployment: included bash scripts

---

## 🛠️ Development

⚠️Development setup has not been fully containerized yet!

[deployment_architecture_diagram]

You'll need
* npm
* .net 8 sdk
* .net 8 runtime
* docker (to run the psql container)

do a

```bash
git clone https://github.com/yourusername/story-dice.git
```
to grab the repo

### 🔄 Basic workflow

```bash
cd frontend
npm install
ng serve
```
in one terminal

```bash
cd backend
dotnet watch
```
in another terminal
Note that dotnet watch isn't as robust as ng serve, and it's better to manually restart.

---

## 📦 Deployment

The basic process is

1. Build
build aspnet core and ouput to deploy/release/angular/
build angular application and output to deploy/release/aspnetcore
2. Package
copy other deployment/devops related files into deploy/release
3. Transfer
rsync deploy/release to remote machine
4. Run
start docker compose services on remote machine using dc_start.sh in some_remote_machine_path/release

Ideally,
```bash
deploy/build_deploy.sh all
```
should do all of these, provided all the environment files were filled out correctly.

[deployment_architecture_diagram]

The production docker compose setup has these services

* postgres
* backend
* nginx

it is assumed that your vps/server/deployment environment has a native reverse proxy where https terminates, which will route traffic to the 'nginx' docker container.

### 🔧 Steps to Production

#### 1. fill out env files

the following env files need to be present and configured for your specific use context:

deploy/.env.prod
deploy/.build_deploy.env
frontend/src/environments/environment.ts

there are .example files for each of these for you to build on and create actual env files from.

make sure to change environment.ts
make sure to change the relevant part in build_deploy.sh to choose the correct build configuration from angular.json
build_deploy.sh assumes that you use key authentication to ssh into your server. please take a look at build_deploy.env.example, and create a build_deploy.env from it with all the variables filled out.

configure basehref and deployurl in angular.json

#### 2. build and push files to remote machine
deploy/build_deploy.sh builds and deploys the application to a remote machine.

#### 3. check nginx / reverse proxy settings, https on remote machine

the default port settings in docker-compose.prod.yml exposes port 80 of the nginx container to port 8080 on the host machine, so incoming connections to the machine for TaleToss should be directed to 8080 by your reverse proxy.

#### 4. start docker compose in remote machine

In the remote machine, cd to the VPS_WORKTREE you specified in build_deploy.env, and do

```bash
dc_start.sh up --build
```

to build and spin up the docker containers.

#### 5. seed database with images

The database comes in without default images at the moment.
Login with the default admin user
```
admin@email.com
```
using the password you set up in .env.prod, then upload svgs using the view at route '/teacher'.

You can use the SVGs at backend/Data/SeedSvgs.

if you get database problems, you can run
```bash
reset_db.sh
```
in the target directory on your server.

### script usage help

build_deploy.sh
```bash
Usage: $0 [OPTIONS]

Options:

build 					build angular and asp.net core application in release/angular, and release/aspnetcore, respectively
package					copy nginx.conf, docker-compose.prod.yml, .env.prod, dc_start.sh, reset_db.sh into release/
build_and_package       build and package
release_to_vps			rsync release/ to $VPS_SSH:$VPS_WORKTREE
start_dc				start docker compose on the vps using $DOCKER_COMPOSE_FILE
all  		            Run all steps (build, package, release_to_vps, start_dc)
help        		    Display this help message

fill out the variables in deploy.env

WARNING: rsync is used with the --delete option. Local state will replace remote state. e.g files in the remote dir which are not on the local dir will be removed
```

dc_start.sh

```bash
Usage: $0 [OPTIONS]

Options:

up 		    start normally
up -d		start with -d
stop 		stop the containers
down		stop AND remove the containers
--build     force build images
help        display this help message
```

## 🤝 Contributing & Contact
Contributions welcome via PRs!
Questions or feedback? Open an issue or email me at cinar.doruk@gmail.com
