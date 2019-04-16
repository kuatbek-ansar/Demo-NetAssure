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
functionName="notify"
packageDir="$srcDir/.serverless"
packageName='netassure-notification-service'
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
Function Name: $functionName
Octo Pack: $octoPackScript
Package Dir: $packageDir
Package Name: $packageName
Source Dir: $srcDir
Version: $version

EOF

export artifacts
export branch
export configFile
export functionName
export octoPackScript
export packageDir
export packageName
export srcDir
export version
export versionTag
