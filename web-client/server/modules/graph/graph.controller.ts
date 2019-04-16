import { Inject } from 'typedi';

import { Host, User } from '../../../models';
import { ZabbixService, LogService } from '../../services';

import { Path, POST, Errors, Context, ServiceContext } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Graphs')
@Path('/graph')
export class GraphController {
  @Inject()
  private zabbixService: ZabbixService;

  @Inject()
  private logService: LogService;

  @Context
  context: ServiceContext;

  constructor() {
  }

  @POST
  public async graphs(host: Host): Promise<any> {
    const user: User = this.context.request['user'];

    const params = {
      output: 'extend',
      hostids: host.zabbixHostId,
      selectItems: 'extend',
      selectGraphItems: 'extend',
      groupids: user.HostGroup.Id,
      selectGroups: [
        'groupid'
      ]
    };

    try {
      const zabbixResponse = await this.zabbixService.post('graph.get', params);

      return zabbixResponse.result;
    } catch (e) {
      this.logService.error('Unable to post graphs to Zabbix', {params: params}, e);
      throw new Errors.InternalServerError();
    }
  }
}
