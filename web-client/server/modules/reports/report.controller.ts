import * as _ from 'lodash';
import { Inject } from 'typedi';

import { VendorEosRepository, CircuitRepository } from '../../repositories';
import { ZabbixService, Layer7Service, ZabbixHostService, TrafficService } from '../../services';
import { User, Circuit, CircuitMonitoringData } from '../../../models';
import { VendorEos, CircuitRecords } from '../../entity/index';
import { Server, Path, GET, POST, DELETE, PathParam, QueryParam, Errors, Context, ServiceContext } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';
import { Layer7Record } from '../../models/layer7-record';
import { TrafficRecord } from '../../models/traffic-record';
import { LogService } from '../../services';
import * as moment from 'moment';

class Top10 {
  top10Upstream: any[];
  top10Downstream: any[];
}

class Bottom10 {
  bottom10Upstream: any[];
  bottom10Downstream: any[];
}

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Reports')
@Path('/report')
export class ReportController {
  @Context
  context: ServiceContext;

  @Inject()
  private vendorEosRepository: VendorEosRepository;

  @Inject()
  private circuitRepository: CircuitRepository;

  @Inject()
  private zabbixService: ZabbixService;

  @Inject()
  private zabbixHostService: ZabbixHostService;

  @Inject()
  private layer7Service: Layer7Service;

  @Inject()
  private trafficService: TrafficService;

  @Inject()
  private logService: LogService;

  constructor() {
  }

  private getGroupId(): number {
    return this.context.request['user'].HostGroup.Id;
  }

  @GET
  @Path('/top10UtilizedInterfaces')
  public async getTop10UtilizedInterfaces(): Promise<Top10> {
    const joined = await this.getNetworkStatistics(this.getGroupId());
    const result = {
      top10Upstream: _.take(_.sortBy(joined, x => 1 - x.upstreamUtilization), 10),
      top10Downstream: _.take(_.sortBy(joined, x => 1 - x.downstreamUtilization), 10)
    };

    return await this.populateTop10HostNames(result);
  }

  @GET
  @Path('/bottom10UtilizedInterfaces')
  public async getBottom10UtilizedInterfaces(): Promise<Bottom10> {
    const joined = await this.getNetworkStatistics(this.getGroupId());
    const result = {
      bottom10Upstream: _.take(_.sortBy(joined, x => x.upstreamUtilization), 10),
      bottom10Downstream: _.take(_.sortBy(joined, x => x.downstreamUtilization), 10)
    };

    return await this.populateBottom10HostNames(result);
  }

  @GET
  @Path('/top10UtilizedCircuits')
  public async getTop10UtilizedCircuits(): Promise<Top10> {
    const joined = await this.filterForCircuits(await this.getNetworkStatistics(this.getGroupId()), this.getGroupId());
    const result = {
      top10Upstream: _.take(_.sortBy(joined, x => 1 - x.upstreamUtilization), 10),
      top10Downstream: _.take(_.sortBy(joined, x => 1 - x.downstreamUtilization), 10)
    };

    return await this.populateTop10HostNames(result);
  }

  @GET
  @Path('/bottom10UtilizedCircuits')
  public async getBottom10UtilizedCircuits(): Promise<Bottom10> {
    const joined = await this.filterForCircuits(await this.getNetworkStatistics(this.getGroupId()), this.getGroupId());
    const result = {
      bottom10Upstream: _.take(_.sortBy(joined, x => x.upstreamUtilization), 10),
      bottom10Downstream: _.take(_.sortBy(joined, x => x.downstreamUtilization), 10)
    };

    return await this.populateBottom10HostNames(result);
  }

  @GET
  @Path('/devicesApproachingEndOfSupport')
  public async getDevicesApproachingEndOfSupport(): Promise<any[]> {
    // get all host versions
    const hostsAndHardwareModelNames = await this.getHostHadwareModelNames(this.getGroupId());

    // look up dates they expire
    const uniqueModelNames = <string[]>Array.from(new Set(hostsAndHardwareModelNames.map(x => x.lastvalue)));
    const endOfLifeDates = await this.getVendorEOSInformation(uniqueModelNames);

    const results = [];
    const hosts = await this.getHosts(hostsAndHardwareModelNames.map(x => x.hostid));
    const now = moment();
    for (const item of hostsAndHardwareModelNames) {
      const result = { ...item, ...endOfLifeDates.find(x => x.hw_pn === item.lastvalue) };

      if (result.eos) {
        result.hostname = hosts.find(x => x.hostid === result.hostid).name;
        result.daysUntilEoS = Math.floor(moment(result.eos).diff(now, 'days'));
        results.push(result);
      }
    }

    return results;
  }


  @GET
  @Path('/devicesPastEndOfSupport')
  public async getDevicesPastEndOfSupport(): Promise<any> {
    // get all host versions
    const hostsAndHardwareModelNames = await this.getHostHadwareModelNames(this.getGroupId());

    // look up dates they expire
    const uniqueModelNames = <string[]>Array.from(new Set(hostsAndHardwareModelNames.map(x => x.lastvalue)));
    const endOfLifeDates = await this.getVendorEOSInformation(uniqueModelNames);

    const results = [];
    const hosts = await this.getHosts(hostsAndHardwareModelNames.map(x => x.hostid));
    const now = moment();
    for (const item of hostsAndHardwareModelNames) {
      const result = { ...item, ...endOfLifeDates.find(x => x.hw_pn === item.lastvalue) };
      if (result.eos && moment(result.eos).isSameOrBefore(now)) {
        result.hostname = hosts.find(x => x.hostid === result.hostid).name;
        result.daysUntilEoS = Math.floor(now.diff(moment(result.eos), 'days'));

        results.push(result);
      }
    }

    return results;
  }

  @GET
  @Path('/layer7')
  public async getLayer7(): Promise<Layer7Record[]> {
    const user: User = this.context.request['user'];

    return await this.layer7Service.GetLastHour(user.HostGroup.Id);
  }

  @GET
  @Path('/topTalkers')
  public async getTopTalkers(): Promise<TrafficRecord[]> {
    const user: User = this.context.request['user'];

    return await this.trafficService.GetLastHour(user.HostGroup.Id);
  }


  @GET
  @Path('/layer7/protocol/:protocol')
  public async getLayer7ForProtocol(@PathParam('protocol') protocol: string): Promise<Layer7Record[]> {
    const user: User = this.context.request['user'];
    const groupId = user.HostGroup.Id;

    return await this.layer7Service.GetLastHourForProtocol(groupId, protocol);
  }

  private async filterForCircuits(interfaces, groupId) {
    const circuits = await this.circuitRepository.find(groupId);

    for (const item of interfaces) {
      item.circuit = circuits.find(y => y.item_id === item.itemIds[0] || y.item_id === item.itemIds[1] || y.item_id === item.itemIds[2]);
    }

    return interfaces.filter(x => x.circuit !== undefined);
  }

  private async populateTop10HostNames(result) {
    const hostsToLookup: any[] = _.union(result.top10Downstream.map(x => x.hostid), result.top10Upstream.map(x => x.hostid));
    const hosts = await this.getHosts(hostsToLookup);

    for (const row of result.top10Upstream) {
      row.hostname = hosts.find(x => x.hostid === row.hostid).name;
    }

    for (const row of result.top10Downstream) {
      row.hostname = hosts.find(x => x.hostid === row.hostid).name;
    }

    return result;
  }

  private async populateBottom10HostNames(result) {
    const hostsToLookup: any[] = _.union(result.bottom10Downstream.map(x => x.hostid), result.bottom10Upstream.map(x => x.hostid));
    const hosts = await this.getHosts(hostsToLookup);

    for (const row of result.bottom10Upstream) {
      row.hostname = hosts.find(x => x.hostid === row.hostid).name;
    }

    for (const row of result.bottom10Downstream) {
      row.hostname = hosts.find(x => x.hostid === row.hostid).name;
    }

    return result;
  }

  private async getNetworkStatistics(groupId) {
    let bitsSent = await this.getBitsSent(groupId);
    let bitsReceived = await this.getBitsReceived(groupId);
    let speed = await this.getSpeed(groupId);

    bitsSent = bitsSent.map(x => {
      return {
        hostid: x.hostid,
        itemid: x.itemid,
        bitsSent: x.lastvalue,
        name: x.name.substring(0, x.name.lastIndexOf(':'))
      };
    });

    bitsReceived = bitsReceived.map(x => {
      return {
        hostid: x.hostid,
        itemid: x.itemid,
        bitsReceived: x.lastvalue,
        name: x.name.substring(0, x.name.lastIndexOf(':'))
      };
    });

    speed = speed.map(x => {
      return {
        hostid: x.hostid,
        itemid: x.itemid,
        speed: x.lastvalue,
        name: x.name.substring(0, x.name.lastIndexOf(':'))
      };
    });
    let joined = [];

    for (const item of bitsSent) {
      const speedItem = speed.find(x => x.name === item.name);
      const bitsReceivedItem = bitsReceived.find(x => x.name === item.name);

      joined.push({
        hostid: item.hostid,
        name: item.name,
        bitsSent: item.bitsSent,
        bitsReceived: bitsReceivedItem.bitsReceived,
        speed: speedItem.speed,
        itemIds: [parseInt(item.itemid, 10), parseInt(speedItem.itemid, 10), parseInt(bitsReceivedItem.itemid, 10)]
      });
    }

    joined = joined.filter(x => x.speed > 0).map(x => ({
      hostid: x.hostid,
      name: x.name,
      bitsSent: x.bitsSent,
      bitsReceived: x.bitsReceived,
      speed: x.speed,
      upstreamUtilization: x.bitsSent / x.speed,
      downstreamUtilization: x.bitsReceived / x.speed,
      itemIds: x.itemIds
    }));

    return joined;
  }

  private async getBitsSent(groupId: string) {
    const params = {
      groupids: [groupId],
      output: [
        'itemid',
        'name',
        'lastvalue',
        'hostid'
      ],
      search: { 'name': 'Bits sent' }
    };

    const zabbixResponse = await this.zabbixService.post('item.get', params);

    return zabbixResponse.result;
  }

  private async getBitsReceived(groupId: string) {
    const params = {
      groupids: [groupId],
      output: [
        'itemid',
        'name',
        'lastvalue',
        'hostid'
      ],
      search: { 'name': 'Bits received' }
    };

    const zabbixResponse = await this.zabbixService.post('item.get', params);

    return zabbixResponse.result;
  }

  private async getSpeed(groupId: string) {
    const params = {
      groupids: [groupId],
      output: [
        'itemid',
        'name',
        'lastvalue',
        'hostid'
      ],
      search: { 'name': 'Speed' }
    };

    const zabbixResponse = await this.zabbixService.post('item.get', params);

    return zabbixResponse.result;
  }

  private async getHosts(hosts: Array<string>) {
    const params = {
      output: [
        'hostid',
        'name'
      ],
      hostids: hosts
    };

    const zabbixResponse = await this.zabbixService.post('host.get', params);

    return zabbixResponse.result;
  }

  private async getHostHadwareModelNames(groupId: number) {
    const params = {
      output: [
        'hostid',
        'name',
        'lastvalue'
      ],
      groupids: [groupId],
      search: { 'name': 'Hardware model name' }
    };

    const zabbixResponse = await this.zabbixService.post('item.get', params);

    return zabbixResponse.result;
  }

  private async getVendorEOSInformation(part_numbers: Array<string>) {
    try {
      const orm = await this.vendorEosRepository.getOrm();
      const builder = orm.createQueryBuilder('eos');

      return await builder.where('eos.hw_pn in (:part_numbers)', { part_numbers: part_numbers }).getMany();
    } catch (e) {
      this.logService.error('Cannot get vendor eos information', { partNumbers: part_numbers }, e);
    }
  }
}
