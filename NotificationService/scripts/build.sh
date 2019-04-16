#!/bin/bash -e

while getopts b:v:r:c: option
do
  case "${option}"
  in
  b) branch=${OPTARG};;
  v) version=${OPTARG};;
  c) clean=${OPTARG};;
  esac
done

# Set default values
branch=${branch:-develop}
version=${version:-1.0}
clean=${clean:-true}

# Get the script directory
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Include the variables
. "$dir/variables.sh" -b $branch -v $version

cd $srcDir

# Create the artifacts directory if it doesn't exist
if [ ! -d "$artifacts" ]; then
  mkdir $artifacts
fi

echo "Installing dependencies with 'npm install --silent'"
npm install --silent

echo "Linting application with 'npm run lint'"
npm run lint

echo "Running unit tests with 'npm run test'"
npm run build:test

echo "Building application with 'npm run build'"
npm run build

# OCTOPUS_URL and OCTOPUS_API_KEY should exist as environment variables
echo "Pushing package to OcotpusDeploy with 'node $octoPackScript ... $packageName $version'"
node $octoPackScript $OCTOPUS_URL $OCTOPUS_API_KEY $packageName $version

if [ "$clean" = true ]; then
  echo "Cleaning '$artifacts'"
  rm -rf $artifacts/*

  echo "Cleaning '$packageDir'"
  rm -rf $packageDir/*
fi
