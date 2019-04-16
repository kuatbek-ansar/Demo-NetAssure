import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, JoinTable } from 'typeorm';
import { AlertGroup } from './alert-group.entity';

@Entity('alertGroupMembers')
export class AlertGroupMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => AlertGroup, alertGroup => alertGroup.members)
    alertGroup: AlertGroup;

    @Column()
    name: string;

    @Column()
    notificationMethod: string;

    @Column()
    address: string;
}
