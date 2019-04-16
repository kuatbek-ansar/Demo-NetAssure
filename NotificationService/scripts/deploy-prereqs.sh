#!/bin/bash -e

if [ ! $"node -v" ]; then
  curl --silent --location https://rpm.nodesource.com/setup_9.x | sudo bash -
  sudo yum -y install nodejs
fi

if [[ ! $(npm list -g serverless | grep serverless) ]]; then
  echo "Installing serverless NPM package"
  npm i -g serverless
fi
