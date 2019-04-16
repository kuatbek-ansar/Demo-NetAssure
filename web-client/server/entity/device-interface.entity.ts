import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceInterface {
  @PrimaryGeneratedColumn()
  interface_id: number;

  @Column('int')
  host_id: number;

  @Column('int')
  item_id: number;

  @Column('varchar')
  displayName: string;

  @Column('int')
  circuit_id: number;
}
