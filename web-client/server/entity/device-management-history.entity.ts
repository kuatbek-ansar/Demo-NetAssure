import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceManagementHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  host_id: number;

  @Column()
  destinationManagedState: boolean;

  @Column()
  changeDate: Date;
}
