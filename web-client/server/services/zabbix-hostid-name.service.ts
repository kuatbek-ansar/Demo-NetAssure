import { Service } from 'typedi';
import { ZabbixService } from './zabbix.service';
import { LogService } from './log.service';
import { HostNameMap } from '../models/host-name-map';

@Service()
export class ZabbixHostIdNameService {
    constructor(private zabbixService: ZabbixService, private log: LogService) {

    }
    public async getHostNames(hostids: string[]): Promise<Array<HostNameMap>> {
        this.log.info('Getting zabbix host names', {hosts: hostids});
        const params = {
            'hostids': hostids,
            'output': ['host', 'name']
        };
        const zabbixResponse = await this.zabbixService.post('host.get', params);
        return zabbixResponse.result;
    }
}
