SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `$MYSQL_DATABASE` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
use `$MYSQL_DATABASE`;

--
-- Table structure for table `vendor_customer`
--
DROP TABLE IF EXISTS `vendor_customer`;
CREATE TABLE IF NOT EXISTS `vendor_customer` (
  `vendor2cust_id` int(8) NOT NULL,
  `groupid` bigint(20) NOT NULL,
  `vendor_name` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='link vendors to customers';

DROP TABLE IF EXISTS `vendor_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_data` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `vendor` varchar(255) COLLATE utf8_bin NOT NULL,
  `model` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `cust_model` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `soft_ver` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `replacement` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `eos` date NOT NULL,
  `link` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vendor_eos`
--
DROP TABLE IF EXISTS `vendor_eos`;
CREATE TABLE IF NOT EXISTS `vendor_eos` (
  `id` mediumint(8) unsigned NOT NULL,
  `vendor` varchar(255) COLLATE utf8_bin NOT NULL,
  `hw_pn` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `hw_desc` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `new_pn` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `new_desc` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `eos` date NOT NULL,
  `sw_ver` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `link` varchar(255) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Table structure for table `vendor_file_types`
--
DROP TABLE IF EXISTS `vendor_file_types`;
CREATE TABLE IF NOT EXISTS `vendor_file_types` (
  `id` int(8) NOT NULL,
  `file_type` varchar(32) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='different files types that can be uploaded';

-- --------------------------------------------------------

--
-- Table structure for table `vendor_files`
--
DROP TABLE IF EXISTS `vendor_files`;
CREATE TABLE IF NOT EXISTS `vendor_files` (
  `id` int(8) NOT NULL,
  `vendorId` int(8) NOT NULL,
  `fileTypeId` int(8) NOT NULL,
  `file_location` varchar(255) COLLATE utf8_bin NOT NULL,
  `file_name` varchar(255) COLLATE utf8_bin NOT NULL,
  `hasSla` BOOL DEFAULT false,
  `uploaded_date` DATETIME
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Table structure for table `vendor_interfaces_files`
--
DROP TABLE IF EXISTS `vendor_interfaces_files`;
CREATE TABLE IF NOT EXISTS `vendor_interfaces_files` (
  `id` int(10) unsigned NOT NULL,
  `groupid` varchar(45) COLLATE utf8_bin NOT NULL,
  `vendor_name` varchar(45) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='link files to interfaces';

--
-- Table structure for table `vendor`
--
CREATE TABLE IF NOT EXISTS vendor (
  vendor_id INT(255) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255),
  known BOOL DEFAULT false,
  PRIMARY KEY (vendor_id)
) ENGINE=InnoDB;

--
-- Table structure for table `circuit`
--
CREATE TABLE IF NOT EXISTS circuit (
  circuit_id INT(255) NOT NULL AUTO_INCREMENT,
  vendor_id INT(255),
  host_id INT(255),
  item_id INT(255),
  owner_account_id VARCHAR(255),
  name VARCHAR(255),
  PRIMARY KEY (circuit_id)
) ENGINE=InnoDB;

--
-- Table structure for table `record`
--
CREATE TABLE IF NOT EXISTS record (
  record_id INT(255) NOT NULL AUTO_INCREMENT,
  owner_account_id VARCHAR(255),
  path TEXT,
  name VARCHAR(255),
  PRIMARY KEY (record_id)
) ENGINE=InnoDB;

--
-- Table structure for table `host`
--
CREATE TABLE IF NOT EXISTS host (
  host_id INT(255) NOT NULL AUTO_INCREMENT,
  is_billable BOOL,
  PRIMARY KEY (host_id)
) ENGINE=InnoDB;

--
-- Table structure for table `vendor_records`
--
CREATE TABLE IF NOT EXISTS vendor_records (
  vendor_id INT(255) NOT NULL,
  record_id INT(255) NOT NULL,
  PRIMARY KEY (vendor_id, record_id)
) ENGINE=InnoDB;

--
-- Table structure for table `circuit_records`
--
CREATE TABLE IF NOT EXISTS circuit_records (
  circuit_id INT(255) NOT NULL,
  record_id INT(255) NOT NULL,
  PRIMARY KEY (circuit_id, record_id)
) ENGINE=InnoDB;

--
-- Table structure for `global_backups`
--
CREATE TABLE IF NOT EXISTS global_backup_configuration(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer_id int NOT NULL,
  enabled bit,
  enablePasswordRequired bit,
  protocol nvarchar(20), # telnet or ssh
  port int,
  userName nvarchar(100),
  password nvarchar(100),
  enablePassword nvarchar(100)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS device_backup_configuration(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  device_id int NOT NULL,
  enabled bit,
  enablePasswordRequired bit,
  protocol nvarchar(20), #telnet or ssh
  port int,
  userName nvarchar(100),
  password nvarchar(100),
  enablePassword nvarchar(100)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `network_maps` (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customer_id` int(8) NOT NULL,
  `name` varchar(255) COLLATE utf8_bin NOT NULL,
  `file_location` varchar(255) COLLATE utf8_bin NOT NULL,
  `file_name` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Indexes for table `vendor_customer`
ALTER TABLE `vendor_customer`
  ADD PRIMARY KEY (`vendor2cust_id`);

-- Indexes for table `vendor_eos`
ALTER TABLE `vendor_eos`
  ADD PRIMARY KEY (`id`);

-- Indexes for table `vendor_file_types`
ALTER TABLE `vendor_file_types`
  ADD PRIMARY KEY (`id`);

-- Indexes for table `vendor_files`
ALTER TABLE `vendor_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vendorId_idx` (`vendorId`),
  ADD KEY `FK_vendor_files_vendor_file_types` (`fileTypeId`);

-- Indexes for table `vendor_interfaces_files`
ALTER TABLE `vendor_interfaces_files`
  ADD PRIMARY KEY (`id`);

-- AUTO_INCREMENT for table `vendor_customer`
ALTER TABLE `vendor_customer`
  MODIFY `vendor2cust_id` int(8) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;

-- AUTO_INCREMENT for table `vendor_eos`
ALTER TABLE `vendor_eos`
  MODIFY `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=116;

-- AUTO_INCREMENT for table `vendor_file_types`
ALTER TABLE `vendor_file_types`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;

-- AUTO_INCREMENT for table `vendor_files`
ALTER TABLE `vendor_files`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;

-- AUTO_INCREMENT for table `vendor_interfaces_files`
ALTER TABLE `vendor_interfaces_files`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;

-- Constraints for table `vendor_files`
ALTER TABLE `vendor_files`
  ADD CONSTRAINT `FK_vendor_files_vendor_customer` FOREIGN KEY (`vendorId`) REFERENCES `vendor_customer` (`vendor2cust_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_vendor_files_vendor_file_types` FOREIGN KEY (`fileTypeId`) REFERENCES `vendor_file_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
