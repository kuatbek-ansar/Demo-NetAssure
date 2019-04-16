#!/bin/bash

nodeMonIsInstalled=$(nodemon -v)
if [ $? -ne 0 ]; then
    echo "Installing Nodemon"
    sudo npm install nodemon -g
fi

angularCLIIsInstalled=$(ng -v)
if [ $? -ne 0 ]; then
    echo "Installing Angular-CLI"
    sudo npm install @angular/cli -g
fi

typeScriptIsInstalled=$(tsc -v)
if [ $? -ne 0 ]; then
    echo "Installing TypeScript"
    sudo npm install typescript -g
fi

tsNodeIsInstalled=$(ts-node -v)
if [ $? -ne 0 ]; then
    echo "Installing ts-node"
    sudo npm install ts-node -g
fi

if [ ! -d './web-client' ]; then
    echo "Checking out code from web-client"
    git clone git@bitbucket.org:affinititeam/web-client.git

    cd ./web-client

    npm install --silent

    if [ -d './server' ]; then
        cd ./server
        npm install --silent
        cd ../
    fi

    cd ../
fi
