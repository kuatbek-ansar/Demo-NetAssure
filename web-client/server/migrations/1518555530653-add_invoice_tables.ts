import {MigrationInterface, QueryRunner} from "typeorm";

export class add_invoice_tables1518555530653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('alter table invoices change column invoiceNumber `number` varchar(50)');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('alter table invoices change column `number` invoiceNumber varchar(50)');
    }

}
