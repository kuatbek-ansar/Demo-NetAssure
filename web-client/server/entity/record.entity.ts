import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  record_id: number;

  @Column('int')
  owner_account_id: number;

  @Column('varchar')
  path: string;

  @Column('varchar')
  name: string;
}
