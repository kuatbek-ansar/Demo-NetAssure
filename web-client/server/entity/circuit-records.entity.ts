import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CircuitRecords {
  @PrimaryGeneratedColumn()
  circuit_id: number;

  @Column('int')
  record_id: number;
}
