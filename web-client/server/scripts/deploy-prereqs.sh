#!/bin/bash -e

if [ ! $"node -v" ]; then
  curl --silent --location https://rpm.nodesource.com/setup_9.x | sudo bash -
  sudo yum -y install nodejs

  # Install NPM global packages
  sudo npm i -g mysql npm typeorm
fi

if [ ! $"npm list -g mysql | grep 'mysql'" ]; then
  echo "Installing mysql NPM package"
    sudo npm i -g mysql
fi

if [ ! $"npm list -g typeorm | grep 'typeorm'" ]; then
    echo "Installing typeorm NPM package"
    sudo npm i -g typeorm
fi
