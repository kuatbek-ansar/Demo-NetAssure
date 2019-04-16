import {MigrationInterface, QueryRunner} from "typeorm";

export class add_alert_groups1515783426028 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`create table alertGroups(
            id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
            group_id int(11),
            name varchar(200) NOT NULL
            ) ENGINE=InnoDB`);
        await queryRunner.query(`create table alertGroupMembers(
                id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                alertGroupId int(11),
                name varchar(200) NOT NULL,
                notificationMethod varchar(50),
                address nvarchar(150)
                ) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`drop table alertGroups`);
        await queryRunner.query(`drop table alertGroupMembers`);
    }

}
