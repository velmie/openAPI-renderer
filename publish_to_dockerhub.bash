#!/bin/bash
Green='\033[0;32m'
Yellow='\033[0;33m'
Purple='\033[0;35m'
NC='\033[0m' # No Color

PKG_VERSION=$(npm -s run env echo '$npm_package_version')
DOCKER_HUB_NAMESPACE='velmie/openapi-renderer'

printf "Build ${Purple}${DOCKER_HUB_NAMESPACE}${NC}:${Yellow}${PKG_VERSION}${NC}\n"
docker build -t $DOCKER_HUB_NAMESPACE:$PKG_VERSION .

printf "Add '${Yellow}latest${NC}' tag${NC}\n"
docker tag $DOCKER_HUB_NAMESPACE:$PKG_VERSION $DOCKER_HUB_NAMESPACE:latest

printf "Push '${Yellow}${PKG_VERSION}${NC}' tag${NC}\n"
docker push $DOCKER_HUB_NAMESPACE:$PKG_VERSION

printf "Push '${Yellow}latest${NC}' tag${NC}\n"
docker push $DOCKER_HUB_NAMESPACE:latest

printf "${Green}Done!${NC}\n"
