import {MigrationInterface, QueryRunner} from "typeorm";

export class ip_not_required1515434782157 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('Alter table circuit modify remote_ip varchar(255) null');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('Alter table circuit modify remote_ip varchar(255) not null');
    }

}
