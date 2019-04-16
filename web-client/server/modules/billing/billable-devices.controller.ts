import { Container, Inject } from 'typedi';
import { InvoiceGenerationService } from '../../services';
import { DeviceManagementHistory, ManagedDeviceCost } from '../../../models';
import { Server, Path, GET, POST, DELETE, PathParam, QueryParam, Errors, Context, ServiceContext, PUT } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';
import { puts } from 'util';


@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Billing')
@Path('/admin/billing')
export class BillableDeviceController {

    @Inject()
    public invoiceGenerationService: InvoiceGenerationService;

    constructor() {

    }

    @GET
    @Path('/devices/:groupId/:date')
    public async getOne(@PathParam('groupId') groupId: string, @PathParam('date') date: string): Promise<Array<ManagedDeviceCost>> {
        return await this.invoiceGenerationService.getBillableDeviceCosts(groupId, date);
    }
}
