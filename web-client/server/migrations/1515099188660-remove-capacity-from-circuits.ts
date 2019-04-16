import {MigrationInterface, QueryRunner} from 'typeorm';

export class RemoveCapacityFromCircuits1515099188660 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('update circuit set sla_throughput = capacity where sla_throughput is null;')
        await queryRunner.query('Alter table circuit drop capacity');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('alter table circuit add capacity double;');
        await queryRunner.query('update circuit set capacity = sla_throughput where capacity is null;')
    }

}
