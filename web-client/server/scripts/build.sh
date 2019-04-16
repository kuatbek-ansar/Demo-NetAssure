#!/bin/bash -e

while getopts b:v:r:c: option
do
  case "${option}"
  in
  b) branch=${OPTARG};;
  v) version=${OPTARG};;
  r) rebuildContainer=${OPTARG};;
  c) clean=${OPTARG};;
  esac
done

# Set default values
branch=${branch:-develop}
version=${version:-1.0}
rebuildContainer=${rebuildContainer:-false}
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

# Only build the application and the container if the Docker image doesn't exist
if [ ! $(docker images -q $dockerImageId:$version) ] || [ "$rebuildContainer" = true ]; then
  echo "Installing dependencies with 'npm install --silent'"
  npm install --silent

  echo "Linting application with 'npm run lint'"
  npm run lint

  echo "Building application with 'npm run build'"
  npm run build

  echo "Running Unit tests with 'npm run test:build'"
  npm run test:build

  echo "Copying '$docsDir' to '$serverArtifacts'"
  cp -rf $docsDir $serverArtifacts

  echo "Copying '$assetsDir' to '$serverArtifacts'"
  cp -rf $assetsDir $serverArtifacts

  echo "Copying '$srcConfigFile' to '$configDir'"
  cp -rf $srcConfigFile $configDir

  echo "Building Docker image with 'docker build ./ --no-cache --rm -q -t $dockerImageId:$version'"
  docker build ./ --rm --no-cache -q -t $dockerImageId:$version

  echo "Tagging Docker image with 'docker tag $dockerImageId:$version $dockerImageId:latest'"
  docker tag $dockerImageId:$version $dockerImageId:latest
fi

# AWS_REGION should exist as environment variables
aws configure set region $AWS_REGION

echo "Logging into container registry"
export _DOCKER_REPO="$(aws ecr get-authorization-token --output text  --query 'authorizationData[].proxyEndpoint')"
aws ecr get-login --no-include-email --region $AWS_REGION | awk '{print $6}' | docker login -u AWS --password-stdin $_DOCKER_REPO

echo "Pushing Docker image to ECR"

echo "Pushing Docker image with 'docker push $dockerImageId:latest'"
docker push $dockerImageId:latest

echo "Pushing Docker image with 'docker push $dockerImageId:$version'"
docker push $dockerImageId:$version

echo "Pushing package to OcotpusDeploy with 'node $octoPack $dockerContainer $version'"
# OCTOPUS_URL and OCTOPUS_API_KEY should exist as environment variables
node $octoPackScript $OCTOPUS_URL $OCTOPUS_API_KEY $dockerContainer $version

if [ "$clean" = true ]; then
  echo "Cleaning '$artifacts'"
  rm -rf $artifacts/*

  if [ $(docker images -q $dockerImageId:$version) ]; then
    echo "Removing Docker image with 'docker image rm -f $dockerImageId:$version'"
    docker image rm -f $dockerImageId:$version
  fi
fi
