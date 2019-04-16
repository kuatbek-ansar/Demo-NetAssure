import {MigrationInterface, QueryRunner} from "typeorm";

export class add_snmp_config1517512486945 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`create table globalSNMPConfiguration (
            id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
            groupId int(11) NOT NULL,
            version varchar(50),
            community varchar(200),
            contextName varchar(50),
            securityName varchar(50),
            securityLevel varchar(50)
        )`);
        await queryRunner.query(`create table deviceSNMPConfiguration (
            id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
            groupId int(11) NOT NULL,
            deviceId int(11) NOT NULL,
            version varchar(50),
            community varchar(200),
            contextName varchar(50),
            securityName varchar(50),
            securityLevel varchar(50)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`drop table globalSNMPConfiguration`);
        await queryRunner.query(`drop table deviceSNMPConfiguration`);
    }

}
