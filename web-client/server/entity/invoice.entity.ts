import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { InvoiceLineItem } from './invoice-line-item.entity';


@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerId: number;

    @Column()
    number: string;

    @Column()
    creationDate: Date;

    @Column()
    generatedBy: string;

    @OneToMany(type => InvoiceLineItem, lineItem => lineItem.invoice, {cascadeInsert: true})
    lineItems: Array<InvoiceLineItem>;
}
