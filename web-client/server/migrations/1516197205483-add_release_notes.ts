import {MigrationInterface, QueryRunner} from 'typeorm';

export class add_release_notes1516197205483 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`create table release_notes(
                                            id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                                            releaseDate date not null,
                                            versionNumber nvarchar(20) not null,
                                            title nvarchar(200) null,
                                            link nvarchar(200) not null) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('drop table release_notes');
    }

}
