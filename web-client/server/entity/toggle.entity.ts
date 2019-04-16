import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('toggles')
export class Toggle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  state: boolean;
}
