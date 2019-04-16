import {MigrationInterface, QueryRunner} from "typeorm";

export class add_missing_vendor_file_types_1519152270661 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      queryRunner.query(`INSERT INTO vendor_file_types (id, file_type)
      VALUES (1, 'MSA'),
             (2, 'SO'),
             (3, 'LOA'),
             (4, 'Invoice')
      ON DUPLICATE KEY UPDATE file_type=file_type`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      // Nothing to do here. Don't want to delete the vendor file type since they might have already existed
    }

}
