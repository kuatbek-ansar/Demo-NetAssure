FROM node:21.2-alpine3.18

ARG artifacts=./artifacts

ENV HOME_DIR=/netassure
ENV API_ENTRYPOINT=server/app.js

# Install bash and nano
RUN apk update && apk add bash nano

# Copy the API files to the home directory
COPY $artifacts $HOME_DIR

WORKDIR $HOME_DIR

# Set the API entry point to executable
RUN \
  chmod +x $API_ENTRYPOINT

EXPOSE 5050

CMD \
  node $API_ENTRYPOINT
