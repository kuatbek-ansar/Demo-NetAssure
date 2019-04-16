#!/bin/bash -e

export TYPEORM_CONNECTION='#{Database-Connection}'
export TYPEORM_HOST='#{Database-Hostname}'
export TYPEORM_PORT='#{Database-Port}'
export TYPEORM_USERNAME='#{Database-Username}'
export TYPEORM_PASSWORD='#{Database-Password}'
export TYPEORM_DATABASE='#{Database-Name}'
export TYPEORM_SYNCHRONIZE='#{Database-Synchronize}'
export TYPEORM_LOGGING='#{Database-Logging}'
export TYPEORM_MIGRATIONS_DIR='#{Database-MigrationsDir}'
export TYPEORM_MIGRATIONS='#{Database-Migrations}'
