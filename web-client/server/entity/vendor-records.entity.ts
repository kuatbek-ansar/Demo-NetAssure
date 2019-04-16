import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VendorRecords {
  @PrimaryGeneratedColumn()
  vendor_id: number;

  @Column('int')
  record_id: number;
}
