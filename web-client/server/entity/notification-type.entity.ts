import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Alert } from './alert.entity';


@Entity('notificationTypes')
export class NotificationTypes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    // used to match the message that comes from zabbix
    @Column()
    matchRegex: string;

    @ManyToMany(type => Alert, alert => alert.notifications)
    @JoinTable({name: 'alertNotifications'})
    alerts: Array<Alert>;
}
