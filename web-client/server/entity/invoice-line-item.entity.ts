import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';


@Entity('invoiceLineItems')
export class InvoiceLineItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    relatedDeviceId: string;

    @Column()
    quantity: number;

    @Column()
    price: number;

    @ManyToOne(type => Invoice, invoice => invoice.lineItems)
    invoice: Invoice;
}
