import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VendorData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  vendor: string;

  @Column('varchar')
  model: string;

  @Column('varchar')
  cust_model: string;

  @Column('varchar')
  soft_ver: string;

  @Column('varchar')
  replacement: string;

  @Column('date')
  eos: Date;

  @Column('varchar')
  link: string;
}
