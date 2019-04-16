import {MigrationInterface, QueryRunner} from 'typeorm';

export class RemoveKnownVendors1515099128771 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // backfill with any currently used vendors as per group vendors
        await queryRunner.query(`INSERT INTO vendor (name, group_id)
                                   SELECT distinct c.name,
                                          md.group_id
                                   FROM vendor v inner join
                                        circuit c on v.id = c.vendorId inner join
                                        managed_device md on c.host_id = md.host_id
                                  WHERE v.known = 1;`);
        // delete any global vendors
        await queryRunner.query('delete from vendor where known = 1;');
        // salt the earth so no new global vendors can grow again
        await queryRunner.query('Alter table vendor drop known');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // add back in the column
        await queryRunner.query('alter table vendor add known tinyint(4)');
        // fill it with global vendors
        await queryRunner.query('INSERT INTO vendor (name, known, group_id) VALUES (\'Spectrum\', true, 0);');
        await queryRunner.query('INSERT INTO vendor (name, known, group_id) VALUES (\'Comcast\', true, 0);');
        await queryRunner.query('INSERT INTO vendor (name, known, group_id) VALUES (\'Bell\', true, 0);');
        await queryRunner.query('INSERT INTO vendor (name, known, group_id) VALUES (\'AT&T\', true, 0);');
        await queryRunner.query('INSERT INTO vendor (name, known, group_id) VALUES (\'Google\', true, 0);');
        await queryRunner.query('INSERT INTO vendor (name, known, group_id) VALUES (\'Verizon\', true, 0);');
    }

}
