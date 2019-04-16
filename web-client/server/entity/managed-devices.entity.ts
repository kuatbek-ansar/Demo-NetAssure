import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Alert } from './index';

@Entity()
export class ManagedDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  host_id: number;

  @Column('int')
  group_id: number;

  @Column('tinyint')
  isManaged: boolean;

  @ManyToMany(type => Alert, alert => alert.managedDevices)
  alerts: Array<Alert>;

}
