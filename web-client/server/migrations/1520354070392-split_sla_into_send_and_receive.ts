import {MigrationInterface, QueryRunner} from 'typeorm';

export class split_sla_into_send_and_receive_1520354070392 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`alter table circuit change column sla_throughput sla_throughput_receive double;`);
        await queryRunner.query(`alter table circuit add sla_throughput_send double default null`);
        await queryRunner.query(`update circuit set sla_throughput_send=sla_throughput_receive`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`alter table circuit change column sla_throughput_receive sla_throughput double;`);
        await queryRunner.query(`alter table circuit drop column sla_throughput_send`);
    }

}
