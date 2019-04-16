import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NetworkMap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  group_id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  file_location: string;

  @Column('varchar')
  file_name: string;
}
