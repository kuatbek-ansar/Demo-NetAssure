import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('release_notes')
export class ReleaseNote {
 @PrimaryGeneratedColumn()
 id: number;

 @Column('varchar')
 versionNumber: string;

 @Column('date')
 releaseDate: Date;

 @Column('varchar')
 title: string;

 @Column('varchar')
 link: string;
}
