import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Vendor } from './vendor.entity';

@Entity()
export class Circuit {
  @PrimaryGeneratedColumn()
  circuit_id: number;

  @Column('int')
  host_id: number;

  @Column('int')
  item_id: number;

  @Column('int')
  group_id: number;

  @Column()
  name: string;

  @Column('int')
  owner_account_id: number;

  @Column({ nullable: true, type: 'double' })
  sla_latency: number;

  @Column({ nullable: true, type: 'double' })
  sla_availability: number;

  @Column({ nullable: true, type: 'double' })
  sla_throughput_send: number;

  @Column({ nullable: true, type: 'double' })
  sla_throughput_receive: number;

  @Column({ nullable: true, type: 'double' })
  sla_jitter: number;

  @Column({ nullable: true, type: 'double' })
  sla_packet_loss: number;

  @Column({ nullable: true, type: 'double' })
  cost: number;

  @Column({ nullable: true, type: 'int' })
  term: number;

  @Column({ nullable: true })
  remote_ip: string;

  @Column({nullable: true, type: 'int'})
  remote_host_id: number;

  @Column({ nullable: true, type: 'double' })
  expectedMonthlyCost: number;

  @ManyToOne(type => Vendor, vendor => vendor.circuits)
  vendor: Vendor;

  @Column({ nullable: true })
  creationDate: Date;

}
