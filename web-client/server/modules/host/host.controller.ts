import { Inject } from 'typedi';

import { Host } from '../../../models';
import { ZabbixService, ZabbixHostService, LogService } from '../../services';
import { Path, GET, PUT, PathParam, Errors, Context, ServiceContext } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Hosts')
@Path('/host')
export class HostController {
  @Context
  context: ServiceContext;

  @Inject()
  private zabbixHostService: ZabbixHostService;

  @Inject()
  private zabbixService: ZabbixService;

  @Inject()
  private logService: LogService;

  @PUT
  public async update(host: Host): Promise<void> {
    // need to rebind because while what comes in looks like a Host it isn't
    host = new Host(host);
    try {
      await this.zabbixService.post('host.update', host.zabbixUpdateDto);

      return;
    } catch (e) {
      this.logService.error('Unable to update host', { host: host }, e);
      throw new Errors.InternalServerError();
    }
  };

  @GET
  @Path('/:hostId')
  public async get(@PathParam('hostId') hostId: number): Promise<Host[]> {
    const groupId = this.context.request['user'].HostGroup.Id;

    try {
      const host = await this.zabbixHostService.getHost(groupId, hostId.toString());
      return [host];
    } catch (e) {
      this.logService.error('Unable to get host by id', { hostId: hostId }, e);
      throw new Errors.InternalServerError();
    }
  }

  @GET
  public async getAll(): Promise<Host[]> {
    const groupId = this.context.request['user'].HostGroup.Id;

    try {
      return this.zabbixHostService.getAllHosts(groupId);
    } catch (e) {
      this.logService.error('Unable to get all hosts', { groupId: groupId }, e);
      throw new Errors.InternalServerError();
    }
  }

  @GET
  @Path('/getByItemId/:itemId')
  public async getHostIdByItemId(@PathParam('itemId') itemId: string): Promise<number> {
    const params = {
      itemids: [itemId],
      selectHosts: ['hostid']
    };

    try {
      const zabbixResponse = await this.zabbixService.post('item.get', params);

      return zabbixResponse.result.map(item => item.hostid)[0];
    } catch (e) {
      this.logService.error('Unable to get host id by item id', { params: params }, e);

      throw new Errors.InternalServerError();
    }
  }
}
