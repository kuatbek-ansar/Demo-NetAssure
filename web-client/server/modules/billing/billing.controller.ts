import { Container, Inject } from 'typedi';
import { SalesforceContactService, InvoiceGenerationService, InvoicePdfGenerator, LogService } from '../../services';
import { Server, Path, GET, POST, DELETE, PathParam, QueryParam, Errors, Context, ServiceContext, PUT, Return } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';
import { puts } from 'util';
import { Invoice, InvoiceLineItem } from '../../entity/index';
import { InvoiceRepository } from '../../repositories/index';
import { BillingPostalCode } from '../../models/billing-postal-code';
import { InvoiceGenerationRequest } from './models/invoice-generation-request';
import * as fs from 'fs';
import * as os from 'os';
import * as pdfkit from 'pdfkit';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Billing')
@Path('/admin/billing')
export class BillingController {
    @Context
    context: ServiceContext;

    @Inject()
    public repository: InvoiceRepository;

    @Inject()
    public salesforceContactService: SalesforceContactService;

    @Inject()
    public invoiceGeneartorService: InvoiceGenerationService;

    @Inject()
    public invoicePdfGenerator: InvoicePdfGenerator;

    @Inject()
    public log: LogService;

    constructor() {
    }


    @GET
    @Path('/invoices/')
    public async getAll(): Promise<Array<any>> {
        return await (await this.repository.getOrm()).query(`
        select i.id,
               customerId,
               creationDate date,
               number,
               sum(quantity*price) amount
        from invoices i left outer join
             invoiceLineItems ili on i.id = ili.invoiceId
        group by i.id, i.customerId, i.creationdate, i.number`);
    }

    @GET
    @Path('/invoices/get-by-group/:groupId')
    public async getByGroup(@PathParam('groupId') groupId: string): Promise<Array<any>> {
        return await (await this.repository.getOrm()).query(`
        select i.id,
               customerId,
               creationDate date,
               number,
               sum(quantity*price) amount
        from invoices i left outer join
             invoiceLineItems ili on i.id = ili.invoiceId
        where customerid=?
        group by i.id, i.customerId, i.creationdate, i.number`, [groupId]);
    }

    @GET
    @Path('/invoices/:id')
    public async getOne(@PathParam('id') id: string): Promise<Invoice> {
        const groupId = this.context.request['user'].HostGroup.Id;
        return await this.repository.findOne({ where: { id: id }, relations: ['lineItems'] });
    }

    @GET
    @Path('/invoices/:id/pdf')
    public async getPdf(@PathParam('id') id: string) {
        this.log.info('Generating PDF for invoice', { id: id });
        const groupId = this.context.request['user'].HostGroup.Id;
        const invoice = await this.repository.findOne({ where: { id: id }, relations: ['lineItems'] });

        const pdf = new pdfkit({
            info: {
                Title: 'Affiniti Network Assure Account Statement',
                Author: 'Affiniti Network Assure'
            }
        });

        // there are some odd race conditions in the pdf library which necessitate writing to disk
        // and then downloading the file instead of streaming it back
        const fileName = os.tmpdir() + '/' + id + '.pdf';
        const fileStream = fs.createWriteStream(fileName);
        pdf.pipe(fileStream);
        this.invoicePdfGenerator.generate(invoice, pdf);
        pdf.flushPages();
        pdf.end();

        const fileStreamPromise = new Promise((resolve, reject) => {
            fileStream.on('finish', () => resolve());
        });

        await fileStreamPromise;
        return new Promise<Return.DownloadBinaryData>((resolve, reject) => {
            this.log.info('PDF written to disk for invoice', { id: id });
            fs.readFile(fileName, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(new Return.DownloadBinaryData(data, 'application/javascript', 'file.pdf'))
            });
        });
    }

    @GET
    @Path('/postalCodes/')
    public async getPostalCodes(): Promise<Array<BillingPostalCode>> {
        const records = (await this.salesforceContactService.getPostalCodes()).records;
        return records.map(x => ({
            groupId: x.Monitor_Abbrev_Id__c,
            postalCode: x.BillingPostalCode,
            name: x.Name
        }));
    }

    @POST
    @Path('/invoices')
    public async create(generationRequest: InvoiceGenerationRequest): Promise<Invoice> {
        const invoice = await this.invoiceGeneartorService.generate(generationRequest.groupId,
            generationRequest.date,
            this.context.request['user'].Account.Name);
        await (await this.repository.getOrm()).save(invoice);
        return invoice;
    }
}
