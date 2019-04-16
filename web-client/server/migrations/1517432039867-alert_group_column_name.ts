import {MigrationInterface, QueryRunner} from "typeorm";

export class alert_group_column_name1517432039867 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`alter table alertGroups add column groupId int(11)`);
        await queryRunner.query(`alter table alertGroups drop column group_id`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`alter table alertGroups add column group_id int(11)`);
        await queryRunner.query(`alter table alertGroups drop column groupId`);
    }

}
