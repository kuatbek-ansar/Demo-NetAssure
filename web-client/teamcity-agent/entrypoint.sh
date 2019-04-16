#!/usr/bin/env sh

# TEAMCITY_SERVER environment variable must be set
if [ -z "$TEAMCITY_SERVER_URL" ]; then
  echo "TEAMCITY_SERVER_URL environment variable must be set"
  exit 1
else
  echo "TEAMCITY_SERVER_URL: $TEAMCITY_SERVER_URL"
  echo "TEAMCITY_AGENT_NAME: $TEAMCITY_AGENT_NAME"
fi

if [ ! -d "bin" ]; then
  echo "Setting up TeamCity agent in $(pwd)"
  unzip -qo buildAgent.zip
  rm buildAgent.zip
else
  echo "Using TeamCity agent in $(pwd)"
fi

if [ ! -e "conf/buildAgent.properties" ]; then
  echo "Creating buildAgent.properties"
  cp conf/buildAgent.dist.properties conf/buildAgent.properties

  sed -i "s/serverUrl=.*/serverUrl=$(echo $TEAMCITY_SERVER_URL | sed -e 's/[\/&]/\\&/g')/" conf/buildAgent.properties
  sed -i "s/name=.*/name=$(echo $TEAMCITY_AGENT_NAME | sed -e 's/[\/&]/\\&/g')/" conf/buildAgent.properties

  cat conf/buildAgent.properties
  chmod +x bin/agent.sh
else
  echo "Using existing buildAgent.properties"
fi

bin/agent.sh run
