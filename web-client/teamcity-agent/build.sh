#!/bin/bash -e

docker build ./ --rm --no-cache -q -t 862965745911.dkr.ecr.us-east-1.amazonaws.com/teamcity-agent:1.0
docker tag 862965745911.dkr.ecr.us-east-1.amazonaws.com/teamcity-agent:1.0 862965745911.dkr.ecr.us-east-1.amazonaws.com/teamcity-agent:latest

export _DOCKER_REPO="$(aws ecr get-authorization-token --output text  --query 'authorizationData[].proxyEndpoint')"
aws ecr get-login --no-include-email | awk '{print $6}' | docker login -u AWS --password-stdin $_DOCKER_REPO

docker push 862965745911.dkr.ecr.us-east-1.amazonaws.com/teamcity-agent:latest
docker push 862965745911.dkr.ecr.us-east-1.amazonaws.com/teamcity-agent:1.0
