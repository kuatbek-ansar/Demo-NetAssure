import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VendorEos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    vendor: string;

    @Column()
    hw_pn: string;

    @Column()
    hw_desc: string;

    @Column()
    new_pn: string;

    @Column()
    new_desc: string;

    @Column()
    eos: Date;

    @Column()
    sw_ver: string;

    @Column()
    link: string;

    @Column()
    newEquipmentCost: number;
}
