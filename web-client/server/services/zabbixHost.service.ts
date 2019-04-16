import { Service } from 'typedi';

import { ZabbixService } from './zabbix.service';
import { Circuit, CircuitMonitoringData, Host } from '../../models';
import { LogService } from './log.service';

class TrendItem {
  itemid: string;
  value_avg: string;
  value_min: string;
  value_max: string;
  num: string;
  clock: string;
}

// These settings control the level of detail that comes back from
// the host.get query and its associated sub-objects.
const hostQueryParams = {
  output: 'extend',
  selectItems: [
    'itemid',
    'name',
    'lastvalue',
    'prevvalue',
    'units',
    'lastclock',
    'lastns',
    'key_',
  ],
  selectInventory: [
    'os',
    'type',
    'serialno_a',
    'serialno_b',
    'hardware',
    'contact',
    'site_address_a',
    'site_address_b',
    'site_address_c',
    'model',
    'location',
    'location_lat',
    'location_lon',
    'notes'
  ],
  selectInterfaces: [
    'interfaceid',
    'ip'
  ],
  selectGroups: [
    'groupid'
  ],
}

@Service()
export class ZabbixHostService {
  constructor(private zabbixService: ZabbixService, private log: LogService) {
  }

  public async getHost(groupId: string, hostId: string): Promise<Host> {
    const params = {
      groupids: groupId,
      hostids: hostId,
      ...hostQueryParams,
    };

    const hosts = await this.getHostsInternal(params);
    return hosts[0];
  }

  public getHosts(groupId: string, hostIds: Array<string>): Promise<Host[]> {
    const params = {
      groupids: groupId,
      hostids: hostIds,
      ...hostQueryParams,
    };
    return this.getHostsInternal(params);
  }

  public getAllHosts(groupId: string): Promise<Host[]> {
    const params = this.stripHostItemsFromQuery({
      groupids: groupId,
      ...hostQueryParams,
    });
    return this.getHostsInternal(params);
  }

  private stripHostItemsFromQuery(params: any) {
    params.selectItems = null;
    return params;
  }

  public async getCircuitMonitoringData(
    remoteHostId: string,
    monitoringIds: any,
  ): Promise<CircuitMonitoringData> {

    const params = {
      output: ['hostid', 'name'],
      hostids: remoteHostId,
      selectItems: ['itemid', 'name', 'key_'],
    }

    const usageIds = {
      in: monitoringIds.in.itemid,
      out: monitoringIds.out.itemid,
    }

    let remoteMonitoringIds = {};

    if (remoteHostId) {
      this.log.debug('Calling Zabbix host.get for getCircuitMonitoringData', {params: params});
      const remoteHost = await this.zabbixService.post('host.get', params);

      const hosts = remoteHost.result;
      const host = hosts[0]

      // build a way to associate itemids with the values they represent:
      //  { icmpping: 1111, icmppingloss: 1112, icmppingsec: 1113 }
      remoteMonitoringIds = host.items.reduce((hash, item) => {
        hash[item.key_] = item.itemid;
        return hash;
      }, {})
    }

    const allMonitoringIds = {
      ...usageIds,
      ...remoteMonitoringIds,
    }

    const itemids = Object.keys(allMonitoringIds).map(k => allMonitoringIds[k]);

    // Get last week of trend data
    const time_from = (new Date().getTime() / 1000 - 24 * 60 * 60 * 7).toFixed(0);
    const trendParams = { output: 'extend', itemids, time_from };

    this.log.debug('Calling Zabbix trend.get for getCircuitMonitoringData', {params: trendParams});
    const zabbixTrend = await this.zabbixService.post('trend.get', trendParams);
    const aggregatedData = {};

    for (const itemid of itemids) {
      aggregatedData[itemid] = { avg_sum: 0, min: +Infinity, max: -Infinity, count: 0 };
    }
    zabbixTrend.result.reduce((a, trendItem: TrendItem) => {
      const record = a[trendItem.itemid];

      record.avg_sum += Number(trendItem.value_avg) * Number(trendItem.num);
      record.min = Math.min(record.min, Number(trendItem.value_min));
      record.max = Math.max(record.max, Number(trendItem.value_max));
      record.count += Number(trendItem.num);

      return a;
    }, aggregatedData)

    const remoteHostMonitoringData = {
      uptime: null,
      latency: null,
      packetLoss: null,
    }

    if (remoteHostId) {

      const uptimeItemId = allMonitoringIds['icmpping'];
      const latencyItemId = allMonitoringIds['icmppingsec'];
      const packetLossItemId = allMonitoringIds['icmppingloss'];

      const uptimeData = aggregatedData[uptimeItemId];
      const latencyData = aggregatedData[latencyItemId];
      const packetLossData = aggregatedData[packetLossItemId]

      remoteHostMonitoringData.uptime = uptimeData.avg_sum / uptimeData.count;
      remoteHostMonitoringData.latency = latencyData.avg_sum / latencyData.count;
      remoteHostMonitoringData.packetLoss = packetLossData.avg_sum / packetLossData.count;
    }

    const bpsInData = aggregatedData[allMonitoringIds.in];
    const bpsOutData = aggregatedData[allMonitoringIds.out];

    return {
      ...remoteHostMonitoringData,
      bpsIn: bpsInData.avg_sum / bpsInData.count,
      bpsInMax: bpsInData.max,
      bpsOut: bpsOutData.avg_sum / bpsOutData.count,
      bpsOutMax: bpsOutData.max,
    };
  }

  private async getHostsInternal(params: any): Promise<Host[]> {
    this.log.debug('Calling Zabbix host.get for getHostsInternal', {params: params});
    const zabbixResponse = await this.zabbixService.post('host.get', params);
    const hostData: any[] = zabbixResponse.result;
    const hosts = hostData.map((host: any) => this.consolidateHostItems(host));

    return hosts;
  }

  private extractNetworkInterfaceMonitoringFieldName(item: any) {
    const regexMatch = item.key_.match(/^net\.if\.(.*)\[.*\.(.*)\]$/)
    if (regexMatch) {
      const field = regexMatch[1].replace(/\./g, '_');
      const id = regexMatch[2];
      return [id, field]
    }

    return []
  }

  private consolidateHostItems(host: any): Host {
    const join = {};
    if (host.items && host.items.length > 0) {
      try {
        host.items
          .filter(item => item.key_ && item.key_.startsWith('net.if'))
          .forEach(item => {
            const [id, field] = this.extractNetworkInterfaceMonitoringFieldName(item)

            if (id) {
              // Populate default values when we first see an interface. Later values may
              // overwrite these.
              join[id] = join[id] || { monitoringData: {} };
              const record = join[id]

              if (field === 'speed') {
                // For better or worse, the app uses the itemid of the speed of an interface as
                // an identifier for the entire interface.
                record.itemid = item.itemid
                record.name = item.name.replace(': Speed', '');
              }

              record.monitoringData[field] = { itemid: item.itemid };
            }
          });
      } catch (e) {
        this.log.error('Unable to consolidate host items', { host: host }, e);
      }
    }
    host.items = Object.keys(join).map(key => join[key]);

    return new Host(host);
  }
}
