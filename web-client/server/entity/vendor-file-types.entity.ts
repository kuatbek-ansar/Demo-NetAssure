import { VendorFiles } from './vendor-files.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VendorFileTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  file_type: string;

  @OneToMany(type => VendorFiles, vendorFile => vendorFile.fileType)
  vendorFile: VendorFiles;
}
