import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddGroupToCircuits1515099168061 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('alter table circuit add group_id int');
        await queryRunner.query(`update circuit c
        inner join managed_device md
        on c.host_id = md.host_id
        set c.group_id = md.group_id;`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('alter table circuit drop group_id;');
    }
}
