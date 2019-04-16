import { Service, Inject } from 'typedi';
import * as pdfkit from 'pdfkit';
import * as pdftable from 'voilab-pdf-table';
import * as columnWidthPlugin from 'voilab-pdf-table/plugins/fitcolumn';
import * as moment from 'moment';
import { Invoice, InvoiceLineItem } from '../entity/index';

@Service()
export class InvoicePdfGenerator {
    public generate(invoice: Invoice, pdf: pdfkit): pdfkit {
        pdf.image('server/assets/img/logo.png', 20, 15, 300);
        pdf.fontSize(20);
        pdf.text('Affiniti Network Assure');
        pdf.fontSize(16);
        pdf.text('Account Statement');
        pdf.moveDown();
        pdf.moveDown();
        pdf.fontSize(10);
        pdf.text('Invoice number:' + invoice.number);
        pdf.text('Date:' + moment(invoice.creationDate).toISOString());
        pdf.moveDown();

        const table = new pdftable(pdf, {
            bottomMargin: 30
        });
        table.setColumnsDefaults({
            headerBorder: 'B',
            align: 'right'
        })
            .addColumns([
                {
                    id: 'name',
                    header: 'Name',
                    align: 'left',
                    width: 200
                },
                {
                    id: 'quantity',
                    header: 'Quantity',
                    width: 50
                },
                {
                    id: 'price',
                    header: 'Price',
                    width: 40
                },
                {
                    id: 'total',
                    header: 'Total',
                    width: 70
                }
            ]);
        const bodyRows = invoice.lineItems.map(x => ({
            name: x.name,
            quantity: x.quantity,
            price: '$ ' + x.price,
            total: '$ ' + (x.quantity * x.price).toFixed(2)
        }));
        table.addBody(bodyRows);
        pdf.text('Total:  $' + invoice.lineItems.map(x => x.quantity * x.price).reduce((curr, now) => curr + now, 0))
        return pdf;
    }
}
