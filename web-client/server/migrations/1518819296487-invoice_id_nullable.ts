import {MigrationInterface, QueryRunner} from "typeorm";

export class invoice_id_nullable1518819296487 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`drop table invoiceLineItems`);
      await queryRunner.query(`create table invoiceLineItems(
        id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
        invoiceId int(11) NULL,
        name varchar(200),
        relatedDeviceId int(11),
        quantity int(11),
        price decimal(9,2),
        FOREIGN KEY (invoiceId) REFERENCES invoices(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`drop table invoiceLineItems`);
      await queryRunner.query(`create table invoiceLineItems(
        id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
        invoiceId int(11) NOT NULL,
        name varchar(200),
        relatedDeviceId int(11),
        quantity int(11),
        price decimal(9,2),
        FOREIGN KEY (invoiceId) REFERENCES invoices(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB`);
    }

}
