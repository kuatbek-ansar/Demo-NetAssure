import { Inject } from 'typedi';

import { ZabbixService, LogService } from '../../services';
import { Host } from '../../../models';
import { Path, POST, Errors, Context, ServiceContext } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Items')
@Path('/item')
export class ItemController {
  @Context
  context: ServiceContext;

  @Inject()
  private zabbixService: ZabbixService;

  @Inject()
  private logService: LogService;

  constructor() {
  }

  @POST
  @Path('/getInterfaceItemsForHost')
  public async getInterfaceItemsForHost(host: Host): Promise<any[]> {
    const groupId = this.context.request['user'].HostGroup.groupId;
    const params = {
      output: 'extend',
      hostids: host.zabbixHostId,
      groupids: groupId,
      selectInterfaces: 'extend',
      selectGroups: [
        'groupid'
      ],
    };

    try {
      const zabbixResponse = await this.zabbixService.post('item.get', params);
      const result = zabbixResponse.result;

      const interfacesOnly = result.filter((item) =>
        (item.name as string).includes(': Speed')
        && !(item.name as string).includes(': #IFNAME')
        && !(item.name as string).includes(': #IFDESCR'));

      interfacesOnly.forEach((item: any) => {
        item.name = item.name.replace(': Speed', '');
      });

      return interfacesOnly;
    } catch (e) {
      this.logService.error('Unable to get interface items for host', {params: params}, e);
      throw new Errors.InternalServerError();
    }
  }

  @POST
  @Path('/getItemsForHost')
  public async getItemsForHost(host: Host): Promise<any[]> {
    const groupId = this.context.request['user'].HostGroup.groupId;
    const params = {
      output: 'extend',
      hostids: host.hostId,
      groupids: groupId,
      selectGroups: [
        'groupid'
      ]
    };

    try {
      const zabbixResponse = await this.zabbixService.post('item.get', params);

      return zabbixResponse.result;
    } catch (e) {
      this.logService.error('Unable to get items for host', {params: params}, e);
      throw new Errors.InternalServerError();
    }
  }
}
