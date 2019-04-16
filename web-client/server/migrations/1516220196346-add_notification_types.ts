import {MigrationInterface, QueryRunner} from "typeorm";

export class add_notification_types1516220196346 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`insert into notificationTypes(message,matchRegex) values ('Link down', '.*Link down.*')`);
        await queryRunner.query(`insert into notificationTypes(message,matchRegex) values ('Unavailable by ICMP ping', 'Unavailable by ICMP ping')`);
        await queryRunner.query(`insert into notificationTypes(message,matchRegex) values ('High bandwidth usage', '.*High bandwidth usage.*')`);
        await queryRunner.query(`insert into notificationTypes(message,matchRegex) values ('Ethernet has changed to lower speed than it was before', '.*: Ethernet has changed to lower speed than it was before')`);
        await queryRunner.query(`insert into notificationTypes(message,matchRegex) values ('In half-duplex mode', '.*: In half-duplex mode')`);
        await queryRunner.query(`insert into notificationTypes(message,matchRegex) values ('High ICMP ping loss', 'High ICMP ping loss')`);
        await queryRunner.query(`insert into notificationTypes(message,matchRegex) values ('High ICMP ping response time', 'High ICMP ping response time')`);
        await queryRunner.query(`insert into notificationTypes(message,matchRegex) values ('High interface error rate', 'Interface.* High error rate')`);
        await queryRunner.query(`insert into notificationTypes(message,matchRegex) values ('Power supply critical', '.*Power supply is in critical state')`);
        await queryRunner.query(`insert into notificationTypes(message,matchRegex) values ('Fan critical', '.*Fan is in critical state')`);
        await queryRunner.query(`insert into notificationTypes(message,matchRegex) values ('Temperature high', '.*Temperature is above warning threshold')`);
        await queryRunner.query(`insert into notificationTypes(message,matchRegex) values ('No SNMP data collected', 'No SNMP data collection')`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('delete from notificationTypes');
    }

}
