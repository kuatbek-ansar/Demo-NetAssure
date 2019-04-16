import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('deviceSNMPConfiguration')
export class DeviceSNMPConfiguration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    groupId: number;

    @Column()
    deviceId: number;

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
