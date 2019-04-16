import { Inject } from 'typedi';
import { Path, GET, POST, PathParam, Errors, Context, ServiceContext } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';

import { DeviceSNMPConfigurationRepository, GlobalSNMPConfigurationRepository } from '../../repositories';
import { DeviceSNMPConfiguration, GlobalSNMPConfiguration } from '../../entity/index';
import { ZabbixService } from '../../services/zabbix.service';
import { LogService } from '../../services';


@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('SNMP')
@Path('/snmpconfig')
export class SNMPConfigController {
  @Context
  context: ServiceContext;

  @Inject()
  public deviceRepository: DeviceSNMPConfigurationRepository;

  @Inject()
  public globalRepository: GlobalSNMPConfigurationRepository;

  @Inject()
  public zabbixService: ZabbixService;

  @Inject()
  public logService: LogService;

  constructor() {
  }

  @GET
  @Path('/global')
  public async getGlobal(): Promise<GlobalSNMPConfiguration> {
    const groupId = this.context.request['user'].HostGroup.Id;
    try {
      return await this.globalRepository.findOne({ where: { groupId: groupId } });
    } catch (e) {
      this.logService.error('Unable to get global snmp config', { groupId: groupId }, e);
      throw new Errors.InternalServerError(e);
    }
  }

  @POST
  @Path('/global')
  public async postGlobal(config: GlobalSNMPConfiguration): Promise<GlobalSNMPConfiguration> {
    const groupId = this.context.request['user'].HostGroup.Id;
    config.groupId = groupId;

    try {
      const orm = await this.globalRepository.getOrm();
      return await orm.save(config);
    } catch (e) {
      this.logService.error('Unable to post global snmp config', { groupId: groupId }, e);
      throw new Errors.InternalServerError(e);
    }
  }

  @GET
  @Path('/device/:deviceid')
  public async getDevice(@PathParam('deviceid') deviceId: number): Promise<DeviceSNMPConfiguration> {
    try {
      return await this.deviceRepository.findOne({ where: { deviceId: deviceId } });
    } catch (e) {
      this.logService.error('Unable to get snmp config by device ', { deviceId: deviceId }, e);
      throw new Errors.InternalServerError(e);
    }
  }

  @POST
  @Path('/device/:deviceid')
  public async postDevice(@PathParam('deviceid') deviceId: number, config: DeviceSNMPConfiguration): Promise<DeviceSNMPConfiguration> {
    const groupId = this.context.request['user'].HostGroup.Id;
    config.groupId = groupId;
    config.deviceId = deviceId;

    try {
      const orm = await this.deviceRepository.getOrm();
      if (config.version === 'v1' || config.version === 'v2c') {
        await this.zabbixService.setSnmpCommunityString(deviceId.toString(), config.community);
      }
      return await orm.save(config);
    } catch (e) {
      this.logService.error('Unable to post snmp config by device', {groupId: groupId, deviceId: deviceId}, e);
      throw new Errors.InternalServerError(e);
    }
  }
}
