import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('globalSNMPConfiguration')
export class GlobalSNMPConfiguration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    groupId: number;

    @Column({nullable: true, type: 'varchar'})
    version: string;

    @Column({nullable: true, type: 'varchar'})
    community: string;

    @Column({nullable: true, type: 'varchar'})
    contextName: string;

    @Column({nullable: true, type: 'varchar'})
    securityName: string;

    @Column({nullable: true, type: 'varchar'})
    securityLevel: string;
}
