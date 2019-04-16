import { Circuit } from './circuit.entity';
import { VendorFiles } from './vendor-files.entity';
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @OneToMany(type => VendorFiles, file => file.vendor)
  files: VendorFiles[];

  @OneToMany(type => Circuit, circuit => circuit.vendor)
  circuits: Circuit[];

  @Column('int', {default: 0})
  group_id: number;
}
