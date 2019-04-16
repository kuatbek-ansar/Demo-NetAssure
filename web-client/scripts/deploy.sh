#!/bin/bash -e

# Values within #{} get replaced at runtime by OctopusDeploy
applicationDir='#{ApplicationDirectory}'
awsRegion='#{AWS-Region}'
environment=$(echo '#{Octopus.Environment.Name}' | tr '[:upper:]' '[:lower:]')
dockerExternalPort='#{Docker-ClientExternalPort}'
dockerInternalPort='#{Docker-ClientInternalPort}'
version='#{Octopus.Action.Package.PackageVersion}'

export AWS_ACCESS_KEY_ID='#{AWS-AccessKeyId}'
export AWS_SECRET_ACCESS_KEY='#{AWS-SecretAccessKey}'

# Get the script directory
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Include the variables
. "$dir/variables.sh" -v $version

# Install any prerequisites
. "$dir/deploy-prereqs.sh"

# Remap the docker compose to be inside the applicationDir
dockerCompose="$applicationDir/$dockerCompose"

cat << EOF
=============================================================
Deployment Variables
=============================================================

Application Directory: $applicationDir
AWS Region: $awsRegion
Environment: $environment
Docker External Port: $dockerExternalPort
Docker Internal Port: $dockerInternalPort
Docker Compose: $dockerCompose
Version: $version

EOF

# If the aws cli is not installed
aws --v > /dev/null 2>&1 || {
  # If pip is not installed
  pip -v > /dev/null 2>&1 || {
    curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
    python get-pip.py
  }

  pip install --upgrade pip
  pip install awscli
}

# Set the region
aws configure set region "$awsRegion"

if [ '#{Deploy-destination}' != 'ECS' ]
then
  echo "Deploying locally"

  # Create the configuration directory if it doesn't exist
  if [ ! -d "$applicationDir/$deployConfigDir" ]; then
    mkdir $applicationDir/$deployConfigDir
  fi

  # Create the configuration
  echo "Creating confguration with 'node $dir/$deployConfigScript $dir/$configFile $applicationDir/$deployConfigDir/$configFile'"
  node $dir/$deployConfigScript $dir/$configFile $applicationDir/$deployConfigDir/$configFile

  echo "Logging into container registry"
  export _DOCKER_REPO="$(aws ecr get-authorization-token --output text  --query 'authorizationData[].proxyEndpoint')"
  aws ecr get-login --no-include-email --region $awsRegion | awk '{print $6}' | docker login -u AWS --password-stdin $_DOCKER_REPO


  echo "Pulling Docker image with 'docker pull $dockerImageId:$version'"
  docker pull $dockerImageId:$version

  # Create the Docker compose file if it doesn't exist
  if [ ! -f "$dockerCompose" ]; then
  echo "$(cat <<'EOF'
  version: '3'
  services:
EOF
      )" > $dockerCompose
  fi

  # If the compose file does not container the Docker image ID
  if ! grep -qE "$dockerImageId" $dockerCompose; then
    # Append the Docker image ID to the compose file
    echo "$(cat <<EOF
    $dockerContainer:
      container_name: $dockerContainer
      image: $dockerImageId:$version
      ports:
        - $dockerExternalPort:$dockerInternalPort
EOF
    )" >> $dockerCompose
  elif grep -qE "$dockerImageId" $dockerCompose; then
    # Otherwise, replace the dockerImageId:version with the current version
    # and write the result to a new temporary compose file
    sed "s#$dockerImageId.*#$dockerImageId:$version#" $dockerCompose > "$dockerCompose.new"

    # Rename  the docker-compose file to delete the temporary file
    mv -f "$dockerCompose.new" $dockerCompose
    rm -f "$dockerCompose.new"
  fi

  echo "Contents of ""$dockerCompose"""
  cat $dockerCompose

  echo "Running Docker-Compose with 'docker-compose up -d'"
  cd $applicationDir
  docker-compose up -d

  echo "Removing unused Docker images with 'docker image prune -a -f'"
  docker image prune -a -f
else
  echo "Deploying to ECS"

  echo "Creating new task definition"
  cat taskDefinition.json
  aws ecs register-task-definition --cli-input-json file://taskDefinition.json --region "$awsRegion"

  latestTaskDef=`aws ecs list-task-definitions --region $awsRegion |grep angular|sort|tail -n 1| sed -e s/[\",]//g `
  echo "Using latest task definition - $latestTaskDef"

  echo "Rolling out service update"
	aws ecs update-service --region "$awsRegion" --service #{Client-Service-ARN} --task-definition $latestTaskDef

fi
