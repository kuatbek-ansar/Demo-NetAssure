#!/bin/bash -e

while getopts b:v: option
do
  case "${option}"
  in
  b) branch=${OPTARG};;
  v) version=${OPTARG};;
  esac
done

branch=${branch:-develop}
version=${version:-1.0}

# Get the directory paths
currentDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
srcDir="$(dirname "$currentDir")"

artifacts="$srcDir/artifacts"
configFile='config.json'
deployConfigScript='deploy-config.js'
deployConfigDir='config-client'
dockerCompose='docker-compose.yaml'
dockerConfigDir='/usr/local/apache2/htdocs/config'
dockerContainer='netassure-client'
dockerImageId="862965745911.dkr.ecr.us-east-1.amazonaws.com/$dockerContainer"
dockerNetworkName='netassure'
octoPackScript="$srcDir/scripts/octo-pack.js"

# Set the version tag by stripping "/ref/heads"
# and "feat-|/", "feature-|/" from the branch name
versionTag="${branch/refs\/heads\//}"
versionTag=$(sed -r 's/feat(\/|\-)?|feature(\/|\-)?//g' <<< $versionTag)

cat << EOF
=============================================================
Variables
=============================================================

Artificats: $artifacts
Config File: $configFile
Deploy Config Script: $deployConfigScript
Deploy Config Dir: $deployConfigDir
Docker Compose: $dockerCompose
Docker Config Dir: $dockerConfigDir
Docker Container: $dockerContainer
Docker Image Id: $dockerImageId
Docker Network Name: $dockerNetworkName
Octo Pack: $octoPackScript
Source Dir: $srcDir
Version: $version

EOF

export artifacts
export branch
export configFile
export deployConfigScript
export deployConfigDir
export dockerCompose
export dockerConfigDir
export dockerContainer
export dockerImageId
export dockerNetworkName
export octoPackScript
export srcDir
export version
export versionTag
