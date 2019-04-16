import { Container, Inject } from 'typedi';
import { SalesforceContactService, ZabbixProxyService, CostingService, InvoiceGenerationService } from '../../services';
import { Server, Path, GET, POST, DELETE, PathParam, QueryParam, Errors, Context, ServiceContext, PUT } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';
import { ZabbixProxy, ProxyGroup } from '../../models/proxy-zabbix-model';
import { ProxyCost } from '../../../models';



@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Proxy')
@Path('/admin/billing')
export class ProxyController {
    @Context
    context: ServiceContext;

    @Inject()
    public invoiceGenerationService: InvoiceGenerationService;

    constructor() {
    }


    @GET
    @Path('/proxy/:groupId')
    public async get(@PathParam('groupId') groupId: string): Promise<Array<ProxyCost>> {
        return this.invoiceGenerationService.getProxyCosts(groupId);
    }
}
