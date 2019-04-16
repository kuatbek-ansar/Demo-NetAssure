import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceBackupConfiguration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  device_id: number;

  @Column('tinyint')
  enabled: boolean;

  @Column('tinyint')
  enablePasswordRequired: boolean;

  @Column('tinyint')
  overrideCredentials: boolean;

  @Column({nullable: true, type: 'varchar'})
  protocol: string;

  @Column({nullable: true, type: 'int'})
  port: number;

  @Column({nullable: true, type: 'varchar'})
  userName: string;

  @Column({nullable: true, type: 'varchar'})
  password: string;

  @Column({nullable: true, type: 'varchar'})
  enablePassword: string;
}
