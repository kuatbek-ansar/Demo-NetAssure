import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeSplunk1518632486698 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    if ((await queryRunner.hasColumn('managed_device', 'splunkLevel7EmbedToken'))) {
      await queryRunner.query(`ALTER TABLE managed_device drop column splunkLevel7EmbedToken`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    if (!(await queryRunner.hasColumn('managed_device', 'splunkLevel7EmbedToken'))) {
      await queryRunner.query(`ALTER TABLE managed_device add column splunkLevel7EmbedToken varchar(255)`);
    }
  }

}
