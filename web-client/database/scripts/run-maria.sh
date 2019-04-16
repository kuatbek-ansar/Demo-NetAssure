
docker run -h netassure-database:127.0.0.1 -d -p 3306:3306 -e MYSQL_DATABASE=netassure -e MYSQL_ALLOW_EMPTY_PASSWORD=true -t mariadb