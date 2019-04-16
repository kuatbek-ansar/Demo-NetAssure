import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ManagedDevice } from './managed-devices.entity';
import { AlertGroup } from './alert-group.entity';
import { NotificationTypes } from './notification-type.entity';


@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  severity?: number;

  @ManyToMany(type => ManagedDevice, managedDevice => managedDevice.alerts)
  @JoinTable({ name: 'alertManagedDevices' })
  managedDevices: Array<ManagedDevice>;

  @ManyToMany(type => AlertGroup, alertGroup => alertGroup.alerts, )
  @JoinTable({ name: 'alertAlertGroups' })
  alertGroups: Array<AlertGroup>;

  @ManyToMany(type => NotificationTypes, notificationTypes => notificationTypes.alerts)
  @JoinTable({ name: 'alertNotifications' })
  notifications: Array<NotificationTypes>;
}
