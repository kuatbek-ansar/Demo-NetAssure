import {MigrationInterface, QueryRunner} from "typeorm";

export class add_invoice_tables1517586986930 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`create table invoices(
            id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
            customerId int(11) NOT NULL,
            invoiceNumber varchar(50),
            creationDate datetime NOT NULL,
            generatedBy varchar(50)
        ) ENGINE=InnoDB`);
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

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`drop table invoiceLineItems`);
        await queryRunner.query(`drop table invoices`);
    }

}
