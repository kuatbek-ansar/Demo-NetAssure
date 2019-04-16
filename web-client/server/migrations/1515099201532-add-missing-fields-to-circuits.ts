import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddMissingFieldsToCircuits1515099201532 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('Alter table circuit add expectedMonthlyCost double default null');
        await queryRunner.query('Alter table circuit add remote_host_id int(11) default null');
        await queryRunner.query('Alter table circuit add remote_ip varchar(255) default null');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('Alter table circuit drop expectedMonthlyCost');
        await queryRunner.query('Alter table circuit drop remote_host_id');
        await queryRunner.query('Alter table circuit drop remote_ip');
    }

}
