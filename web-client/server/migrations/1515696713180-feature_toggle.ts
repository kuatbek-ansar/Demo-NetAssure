import {MigrationInterface, QueryRunner} from 'typeorm';

export class feature_toggle1515696713180 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
       await queryRunner.query(`create table toggles(
                                    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                                    name varchar(200) NOT NULL,
                                    state tinyint(4) default 0) ENGINE=InnoDB`);
       await queryRunner.query(`insert into toggles(name, state) values('alerts', 0)`); // disabled for now
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('drop table toggles');
    }

}
