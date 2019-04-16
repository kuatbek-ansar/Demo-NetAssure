import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { AlertGroupMember } from './alert-group-member.entity';
import { Alert } from './index';

@Entity('alertGroups')
export class AlertGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupId: number;

  @Column()
  name: string;

  @OneToMany(type => AlertGroupMember, alertGroupMember => alertGroupMember.alertGroup, {
    cascadeInsert: true,
    cascadeUpdate: true
  })
  members: AlertGroupMember[];

  @ManyToMany(type => Alert, alert => alert.alertGroups)
  alerts: Array<Alert>;
}
