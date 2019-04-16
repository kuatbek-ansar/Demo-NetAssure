import { Service } from 'typedi';
import { ZabbixService } from './zabbix.service';
import { Notification, ZabbixHostGroupOrigin } from '../../models';
import { ZabbixNotificationStatusEnum, ZabbixNotificationSeverityEnum } from '../../models/';
import { ZabbixProxy, ZabbixHostGroupMappingEnvelope, ProxyGroup } from '../models/proxy-zabbix-model';
import { CacheService } from './cache.service';
import { LogService } from './log.service';


@Service()
export class ZabbixProxyService {
  baseParams = {
    output: ['host'],
    selectHosts: ['hostid']
  };
  proxiesCacheKey = 'ZabbixProxyService:proxiesAndHosts';
  hostsCacheKey = 'ZabbixProxyService:hostGroupMap';

  constructor(private zabbixService: ZabbixService, private cacheService: CacheService, private log: LogService) {
  }

  public async getByGroupId(groupId: string): Promise<ProxyGroup[]> {
    const proxiesAndHosts = this.cacheService.contains(this.proxiesCacheKey) ?
      this.cacheService.get(this.proxiesCacheKey) :
      await this.getProxies();
    this.cacheService.set(this.proxiesCacheKey, proxiesAndHosts);
    const keyHostIds: string[] = [];
    for (const proxy of proxiesAndHosts) {
      if (proxy.hosts.length > 0) {
        // assume that the first reporting host is in the correct group
        keyHostIds.push(proxy.hosts[0].hostid);
      }
    }

    const hostGroupMap = this.cacheService.contains(this.hostsCacheKey) ?
      this.cacheService.get(this.hostsCacheKey) :
      await this.getHostGroups(keyHostIds);
    this.cacheService.set(this.hostsCacheKey, hostGroupMap);

    return this.combineGroupsAndProxies(proxiesAndHosts, hostGroupMap, groupId);
  }

  private async getProxies(): Promise<ZabbixProxy[]> {
    // we have to get all proxies as they aren't set up by group
    const params = {
      ...this.baseParams
    };

    this.log.debug('Calling Zabbix proxy.get for getProxies', { params: params });
    const zabbixResponse = await this.zabbixService.post('proxy.get', params);
    return zabbixResponse.result;
  }

  private async getHostGroups(keyHostIds: string[]) {
    const hostParams = {
      output: ['hostid'],
      hostids: keyHostIds,
      selectGroups: ['id']
    };

    this.log.debug('Calling Zabbix host.get for getHostGroups', { params: hostParams });
    const zabbixHostResponse: ZabbixHostGroupMappingEnvelope = await this.zabbixService.post('host.get', hostParams);
    const hostGroupMap = zabbixHostResponse.result.map(x =>
      ({
        hostid: x.hostid,
        groupid: x.groups[0].groupid
      }));
    return hostGroupMap;
  }

  private combineGroupsAndProxies(proxiesAndHosts, hostGroupMap, groupId) {
    const results = [];
    if (proxiesAndHosts) {
      for (const proxy of proxiesAndHosts.filter(x => x.hosts.length > 0)) {
        const proxyGroupId = hostGroupMap.find(x => x.hostid === proxy.hosts[0].hostid).groupid;
        if (proxyGroupId === groupId.toString()) {
          results.push({
            hostname: proxy.host,
            reportingDevices: proxy.hosts.length,
            hostid: proxy.proxyid
          });
        }
      }
    }
    return results;
  }
}
