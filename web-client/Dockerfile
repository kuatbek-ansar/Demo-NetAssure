FROM httpd:2-alpine3.19

ARG artifacts=./artifacts

ENV HOME_DIR=/usr/local/apache2/htdocs

# Install bash and nano
RUN apk update && apk add bash nano

COPY $artifacts $HOME_DIR

EXPOSE 80
