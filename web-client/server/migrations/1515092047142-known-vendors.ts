import {MigrationInterface, QueryRunner} from 'typeorm';

export class KnownVendors1515092047142 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('INSERT INTO vendor (name, known, group_id) VALUES (\'Spectrum\', true, 0);');
        await queryRunner.query('INSERT INTO vendor (name, known, group_id) VALUES (\'Comcast\', true, 0);');
        await queryRunner.query('INSERT INTO vendor (name, known, group_id) VALUES (\'Bell\', true, 0);');
        await queryRunner.query('INSERT INTO vendor (name, known, group_id) VALUES (\'AT&T\', true, 0);');
        await queryRunner.query('INSERT INTO vendor (name, known, group_id) VALUES (\'Google\', true, 0);');
        await queryRunner.query('INSERT INTO vendor (name, known, group_id) VALUES (\'Verizon\', true, 0);');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DELETE FROM vendor WHERE name = \'Spectrum\' AND group_id = 0;');
        await queryRunner.query('DELETE FROM vendor WHERE name = \'Comcast\' AND group_id = 0;');
        await queryRunner.query('DELETE FROM vendor WHERE name = \'Bell\' AND group_id = 0;');
        await queryRunner.query('DELETE FROM vendor WHERE name = \'AT&T\' AND group_id = 0;');
        await queryRunner.query('DELETE FROM vendor WHERE name = \'Google\' AND group_id = 0;');
        await queryRunner.query('DELETE FROM vendor WHERE name = \'Verizon\' AND group_id = 0;');
    }

}
