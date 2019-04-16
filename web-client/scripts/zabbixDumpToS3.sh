#!/bin/bash

red='\e[0;31m'
RED='\e[1;31m' 
green='\e[0;32m'
GREEN='\e[1;32m' 
blue='\e[0;34m'
BLUE='\e[1;34m' 
purple='\e[0;35m'
PURPLE='\e[1;35m' 
NC='\e[0m'

MySQL_USER=zabbix
MySQL_PASSWORD=zabbix
MySQL_HOST=localhost
MySQL_PORT=3306
MySQL_DATABASE_NAME=zabbix


S3_BUCKET=s3://affiniti-netassure/dev/zabbix/


MYSQL_BIN_PATH=/usr/bin/mysql

MYSQL_DUMP_PATH=/tmp/dump_to_s3

TIMESTAMP=$(($(date +'%s')-3600))

# Command to run mysql
MYSQL_CMD="${MYSQL_BIN_PATH} -u${MySQL_USER} -p${MySQL_PASSWORD}  -h${MySQL_HOST} ${MySQL_DATABASE_NAME}"

# Generate a timestamp where clause for tables with a clock column
ClockWhere () {
  if [ -z $PREVIOUS_TIMESTAMP ] 
  then
    echo "clock <= $TIMESTAMP"
  else
    echo "clock <= $TIMESTAMP AND clock > $PREVIOUS_TIMESTAMP"
  fi
}


SetupDumpPath () {
    [ -d ${MYSQL_DUMP_PATH} ] || mkdir -p ${MYSQL_DUMP_PATH}
    cd ${MYSQL_DUMP_PATH}
}

FetchPreviousTimestamp () {
    aws s3 cp ${S3_BUCKET}/previous_timestamp previous_timestamp || echo To previous timestamp. Dumping all history.
    if [ -f previous_timestamp ] 
    then 
        PREVIOUS_TIMESTAMP=$(cat previous_timestamp)
    fi
}

DumpDatabase () {
    NON_HISTORY_TABLES=$($MYSQL_CMD -e "show tables"\
      |egrep -v "(Tables_in_zabbix|history*|trends*|acknowledges|alerts|auditlog|events|service_alarms)")

    HISTORY_TABLES=$($MYSQL_CMD -e "show tables"\
      |egrep "(history*|trends*|acknowledges|alerts|auditlog|events|service_alarms)")

    for TABLE in $NON_HISTORY_TABLES
    do
        mkdir -p ${TABLE}
        $MYSQL_CMD -B -e "SELECT * from $TABLE" | gzip - > ${TABLE}/${TABLE}.csv.gz
    done

    for TABLE in $HISTORY_TABLES
    do
	mkdir -p $TABLE
        $MYSQL_CMD -B -e "SELECT * from $TABLE" | gzip - > ${TABLE}/${TABLE}_${TIMESTAMP}.csv.gz
    done
    
    echo ${TIMESTAMP} > previous_timestamp
}

SyncWithS3 () {
   aws s3 sync --quiet ${MYSQL_DUMP_PATH} ${S3_BUCKET}
}

Cleanup () {
    cd -
    rm -rf ${MYSQL_DUMP_PATH}
}

SetupDumpPath
FetchPreviousTimestamp
DumpDatabase
SyncWithS3
Cleanup

