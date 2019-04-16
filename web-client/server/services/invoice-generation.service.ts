import { Service, Inject } from 'typedi';
import { Invoice, InvoiceLineItem } from '../entity';
import { ManagedDeviceCost, ProxyCost } from '../../models';
import { DeviceManagementHistoryRepository } from '../repositories';
import { ZabbixHostIdNameService, CostingService } from '../services';
import { ZabbixProxyService } from './zabbixProxy.service';
import * as moment from 'moment';

@Service()
export class InvoiceGenerationService {

    @Inject()
    public repository: DeviceManagementHistoryRepository;

    @Inject()
    public zabbixHostNameLookup: ZabbixHostIdNameService;

    @Inject()
    public costingService: CostingService;

    @Inject()
    public zabbixProxyService: ZabbixProxyService;

    public async generate(groupId: string, date: string, generatingPerson: string): Promise<Invoice> {
        const invoice = new Invoice();
        invoice.generatedBy = generatingPerson;
        invoice.customerId = parseInt(groupId, 10);
        const momentDate = moment.utc(date);
        invoice.number = `${momentDate.format('YYYYMM')}-${groupId}`;
        invoice.creationDate = momentDate.toDate();
        invoice.lineItems = await this.getLineItems(groupId, date);
        return invoice;
    }

    public async getBillableDeviceCosts(groupId: string, date: string): Promise<Array<ManagedDeviceCost>> {
        const hostids = await this.repository.getBillableUnits(groupId, new Date(date));
        const hostnames = await this.zabbixHostNameLookup.getHostNames(hostids.map(x => x.hostid));
        for (const host of hostids) {
            host.name = hostnames.find(x => x.hostid === host.hostid).name;
        }
        return this.costingService.setBillableDeviceCosts(hostids);
    }

    public async getProxyCosts(groupId: string): Promise<Array<ProxyCost>> {
        const proxyGroups = await this.zabbixProxyService.getByGroupId(groupId);
        const results: ProxyCost[] = [];
        for (const proxy of proxyGroups) {
            results.push({
                hostname: proxy.hostname,
                reportingDevices: proxy.reportingDevices,
                cost: 0,
                hostid: proxy.hostid
            });
        }
        return this.costingService.setProxyCosts(results);
    }

    public async getLineItems(groupId: string, date: string): Promise<Array<InvoiceLineItem>> {
        const lineItems: Array<InvoiceLineItem> = [];
        for (const device of await this.getBillableDeviceCosts(groupId, date)) {
            const item = new InvoiceLineItem();
            item.name = `Monitored device ${device.name}`;
            item.price = device.cost;
            item.quantity = 1;
            item.relatedDeviceId = device.hostid;
            lineItems.push(item);
        }
        for (const device of await this.getProxyCosts(groupId)) {
            const item = new InvoiceLineItem();
            item.name = `Appliance ${device.hostname}`;
            item.price = device.cost;
            item.quantity = 1;
            item.relatedDeviceId = device.hostid;
            lineItems.push(item);
        }
        return lineItems;
    }

    private pad(num, size) {
        const s = '000000000' + num;
        return s.substr(s.length - size);
    }
}

