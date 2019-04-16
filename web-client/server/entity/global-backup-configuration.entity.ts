import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GlobalBackupConfiguration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  customer_id: number;

  @Column('tinyint')
  enabled: boolean;

  @Column('tinyint')
  enablePasswordRequired: boolean;

  @Column({ nullable: true, type: 'varchar' })
  protocol: string;

  @Column({ nullable: true, type: 'int' })
  port: number;

  @Column({ nullable: true, type: 'varchar' })
  userName: string;

  @Column({ nullable: true, type: 'varchar' })
  password: string;

  @Column({ nullable: true, type: 'varchar' })
  enablePassword: string;
}
