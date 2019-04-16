import { MigrationInterface, QueryRunner } from "typeorm";

export class add_alerts1516108782025 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE alerts (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                                                     groupId int(11) NOT NULL,
                                                     name varchar(255) NOT NULL,
                                                     severity int(11) NULL) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE notificationTypes (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                                                            message varchar(255) NOT NULL,
                                                            matchRegex varchar(255) NOT NULL) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE alertManagedDevices (alertsId int(11) NOT NULL,
                                                                   managedDeviceId int(11) NOT NULL,
                                                       PRIMARY KEY(alertsId, managedDeviceId)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE alertAlertGroups (alertsId int(11) NOT NULL,
                                                                alertGroupsId int(11) NOT NULL,
                                                     PRIMARY KEY(alertsId, alertGroupsId)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE alertNotifications (alertsId int(11) NOT NULL,
                                                                  notificationTypesId int(11) NOT NULL,
                                                      PRIMARY KEY(alertsId, notificationTypesId)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE alertManagedDevices ADD CONSTRAINT fk_alertManagedDevices_alerts
                                       FOREIGN KEY (alertsId) REFERENCES alerts(id) ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE alertManagedDevices ADD CONSTRAINT fk_alertManagedDevices_managedDevices
                                       FOREIGN KEY (managedDeviceId) REFERENCES managed_device(id)`);
        await queryRunner.query(`ALTER TABLE alertAlertGroups ADD CONSTRAINT fk_alertAlertGroups_alerts
                                       FOREIGN KEY (alertsId) REFERENCES alerts(id)  ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE alertAlertGroups ADD CONSTRAINT fk_alertAlertGroups_alertGroups
                                        FOREIGN KEY (alertGroupsId) REFERENCES alertGroups(id)`);
        await queryRunner.query(`ALTER TABLE alertNotifications ADD CONSTRAINT fk_alertNotifications_alertNotifications
                                        FOREIGN KEY (alertsId) REFERENCES alerts(id) ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE alertNotifications ADD CONSTRAINT fk_alertNotifications_notifications
                                        FOREIGN KEY (notificationTypesId) REFERENCES notificationTypes(id)`);
            }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`drop table alertManagedDevices`);
        await queryRunner.query(`drop table alertAlertGroups`);
        await queryRunner.query(`drop table alertNotifications`);
        await queryRunner.query(`drop table notificationTypes`);
        await queryRunner.query(`drop table alerts`);
    }

}
