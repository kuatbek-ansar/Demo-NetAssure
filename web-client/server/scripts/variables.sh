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
assetsDir="$srcDir/assets"
configFile="config.json"
configDir="$srcDir/artifacts/server/config"
deployConfigScript='deploy-config.js'
deployConfigDBScript='deploy-config-db.sh'
deployConfigDir='/netassure/config-api'
dockerCompose='docker-compose.yaml'
dockerConfigDir='/netassure/server/config'
dockerContainer='netassure-api'
dockerImageId="862965745911.dkr.ecr.us-east-1.amazonaws.com/$dockerContainer"
docsDir="$srcDir/docs"
octoPackScript="$srcDir/scripts/octo-pack.js"
serverArtifacts="$srcDir/artifacts/server"
srcConfigFile="$srcDir/config/$configFile"

# Set the version tag by stripping "/ref/heads"
# and "feat-|/", "feature-|/" from the branch name
versionTag="${branch/refs\/heads\//}"
versionTag=$(sed -r 's/feat(\/|\-)?|feature(\/|\-)?//g' <<< $versionTag)

cat << EOF
=============================================================
Variables
=============================================================

Artifacts: $artifacts
Assets Dir: $assetsDir
Config File: $configFile
Deploy Config Script: $deployConfigScript
Deploy Config DB Script: $deployConfigDBScript
Docker Compose: $dockerCompose
Docker Config Dir: $dockerConfigDir
Docker Container: $dockerContainer
Docker Image Id: $dockerImageId
Docs Dir: $docsDir
Octo Pack Script: $octoPackScript
Source Dir: $srcDir
Server Artifacts: $serverArtifacts
Source Config File: $srcConfigFile
Version: $version

EOF

export artifacts
export branch
export configFile
export deployConfigScript
export deployConfigDBScript
export dockerCompose
export dockerConfigDir
export dockerContainer
export dockerImageId
export docsDir
export octoPackScript
export srcDir
export serverArtifacts
export srcConfigFile
export version
export versionTag
