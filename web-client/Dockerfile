FROM httpd:2.4.59-alpine3.20

ARG artifacts=./artifacts

ENV HOME_DIR=/usr/local/apache2/htdocs

# Install bash and nano
RUN apk update && apk add bash nano

COPY $artifacts $HOME_DIR

EXPOSE 80
