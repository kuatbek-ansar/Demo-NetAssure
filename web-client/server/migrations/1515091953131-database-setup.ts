import {MigrationInterface, QueryRunner} from 'typeorm';

export class DatabaseSetup1515091953131 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `circuit_records` (`circuit_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `record_id` int(11) NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `vendor_file_types` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `file_type` varchar(255) NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `vendor_files` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `group_id` int(11) NOT NULL DEFAULT 0, `file_location` varchar(255) NOT NULL, `file_name` varchar(255) NOT NULL, `hasSla` tinyint(4) NOT NULL, `uploaded_date` datetime NOT NULL, `fileTypeId` int(11), `vendorId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `vendor` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `name` varchar(255) NOT NULL, `known` tinyint(4) NOT NULL DEFAULT 0, `group_id` int(11) NOT NULL DEFAULT 0) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `circuit` (`circuit_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `host_id` int(11) NOT NULL, `item_id` int(11) NOT NULL, `name` varchar(255) NOT NULL, `owner_account_id` int(11) NOT NULL, `sla_latency` double, `sla_availability` double, `sla_throughput` double, `sla_jitter` double, `sla_packet_loss` double, `cost` double, `term` int(11), `capacity` double, `creationDate` datetime, `vendorId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `device_backup_configuration` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `device_id` int(11) NOT NULL, `enabled` tinyint(4) NOT NULL, `enablePasswordRequired` tinyint(4) NOT NULL, `overrideCredentials` tinyint(4) NOT NULL, `protocol` varchar(255), `port` int(11), `userName` varchar(255), `password` varchar(255), `enablePassword` varchar(255)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `device_interface` (`interface_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `host_id` int(11) NOT NULL, `item_id` int(11) NOT NULL, `displayName` varchar(255) NOT NULL, `circuit_id` int(11) NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `device_management_history` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `host_id` int(11) NOT NULL, `destinationManagedState` tinyint(4) NOT NULL, `changeDate` datetime NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `global_backup_configuration` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `customer_id` int(11) NOT NULL, `enabled` tinyint(4) NOT NULL, `enablePasswordRequired` tinyint(4) NOT NULL, `protocol` varchar(255), `port` int(11), `userName` varchar(255), `password` varchar(255), `enablePassword` varchar(255)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `managed_device` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `host_id` int(11) NOT NULL, `group_id` int(11) NOT NULL, `isManaged` tinyint(4) NOT NULL, `splunkLevel7EmbedToken` varchar(255) NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `network_map` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `group_id` int(11) NOT NULL, `name` varchar(255) NOT NULL, `file_location` varchar(255) NOT NULL, `file_name` varchar(255) NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `record` (`record_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `owner_account_id` int(11) NOT NULL, `path` varchar(255) NOT NULL, `name` varchar(255) NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `vendor_data` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `vendor` varchar(255) NOT NULL, `model` varchar(255) NOT NULL, `cust_model` varchar(255) NOT NULL, `soft_ver` varchar(255) NOT NULL, `replacement` varchar(255) NOT NULL, `eos` date NOT NULL, `link` varchar(255) NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `vendor_eos` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `vendor` varchar(255) NOT NULL, `hw_pn` varchar(255) NOT NULL, `hw_desc` varchar(255) NOT NULL, `new_pn` varchar(255) NOT NULL, `new_desc` varchar(255) NOT NULL, `eos` datetime NOT NULL, `sw_ver` varchar(255) NOT NULL, `link` varchar(255) NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `vendor_records` (`vendor_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `record_id` int(11) NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `vendor_files` ADD CONSTRAINT `fk_6c3475551cc3e3e5e6fac1569ed` FOREIGN KEY (`fileTypeId`) REFERENCES `vendor_file_types`(`id`)");
        await queryRunner.query("ALTER TABLE `vendor_files` ADD CONSTRAINT `fk_cc5a36c56f85fe70f6c5ce6aed3` FOREIGN KEY (`vendorId`) REFERENCES `vendor`(`id`)");
        await queryRunner.query("ALTER TABLE `circuit` ADD CONSTRAINT `fk_79b320313e7f85bd71e9bcbfc69` FOREIGN KEY (`vendorId`) REFERENCES `vendor`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `circuit` DROP FOREIGN KEY `fk_79b320313e7f85bd71e9bcbfc69`");
        await queryRunner.query("ALTER TABLE `vendor_files` DROP FOREIGN KEY `fk_cc5a36c56f85fe70f6c5ce6aed3`");
        await queryRunner.query("ALTER TABLE `vendor_files` DROP FOREIGN KEY `fk_6c3475551cc3e3e5e6fac1569ed`");
        await queryRunner.query("DROP TABLE `vendor_records`");
        await queryRunner.query("DROP TABLE `vendor_eos`");
        await queryRunner.query("DROP TABLE `vendor_data`");
        await queryRunner.query("DROP TABLE `record`");
        await queryRunner.query("DROP TABLE `network_map`");
        await queryRunner.query("DROP TABLE `managed_device`");
        await queryRunner.query("DROP TABLE `global_backup_configuration`");
        await queryRunner.query("DROP TABLE `device_management_history`");
        await queryRunner.query("DROP TABLE `device_interface`");
        await queryRunner.query("DROP TABLE `device_backup_configuration`");
        await queryRunner.query("DROP TABLE `circuit`");
        await queryRunner.query("DROP TABLE `vendor`");
        await queryRunner.query("DROP TABLE `vendor_files`");
        await queryRunner.query("DROP TABLE `vendor_file_types`");
        await queryRunner.query("DROP TABLE `circuit_records`");
    }

}
