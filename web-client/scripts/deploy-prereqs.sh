#!/bin/bash -e

if [ ! $"node -v" ]; then
  curl --silent --location https://rpm.nodesource.com/setup_9.x | sudo bash -
  sudo yum -y install nodejs
  npm i -g mysql npm typeorm
fi
