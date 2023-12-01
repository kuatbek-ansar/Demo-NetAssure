FROM node:21.2-alpine3.18

ENV JAVA_HOME=/usr/lib/jvm/jre
ENV PATH $PATH:$JAVA_HOME/bin
ENV TEAMCITY_SERVER_URL=http://teamcity-server:8111
ENV TEAMCITY_AGENT_NAME=teamcity-agent-1
ENV TEAMCITY_AGENT_DIR=/opt/teamcity-agent
ENV NODE_PACKAGES='@angular/cli npm ts-node typescript@2.4.2'

VOLUME $TEAMCITY_AGENT_DIR/conf

# Install packages
RUN apk update && apk add \
  bash \
  curl \
  gettext \
  git \
  less \
  nano \
  py-pip \
  python \
  openjdk8-jre-base && \
  pip install --upgrade pip awscli s3cmd

# Install edge version of Docker
RUN echo "@community http://dl-4.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
  apk --update add docker@community

# Create a simlink to the Java directory
RUN ln -s /usr/lib/jvm/java-1.8-openjdk $JAVA_HOME

# Install global NPM packages
RUN npm -g config set user root
RUN npm i -g $NODE_PACKAGES

# Create the AWS config directory
RUN mkdir /root/.aws

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY buildAgent.zip ${TEAMCITY_AGENT_DIR}

EXPOSE 9090

WORKDIR $TEAMCITY_AGENT_DIR

ENTRYPOINT ["/entrypoint.sh"]
