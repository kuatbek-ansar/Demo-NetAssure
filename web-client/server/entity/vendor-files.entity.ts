import { VendorFileTypes } from './vendor-file-types.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Vendor } from './vendor.entity';

@Entity()
export class VendorFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', {default: 0})
  group_id: number;

  @ManyToOne(type => VendorFileTypes, fileType => fileType.vendorFile)
  fileType: VendorFileTypes;

  @Column('varchar')
  file_location: string;

  @Column('varchar')
  file_name: string;

  @Column('tinyint')
  hasSla: boolean;

  @Column('datetime')
  uploaded_date: Date;

  @ManyToOne(type => Vendor, vendor => vendor.files)
  vendor: Vendor;
}
