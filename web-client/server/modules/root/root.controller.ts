import { Inject } from 'typedi';

import { SalesForceAuthenticationService, ZabbixService } from '../../services';
import { GET, Path, Errors } from 'typescript-rest';
import { Tags } from 'typescript-rest-swagger';
import { LogService } from '../../services/log.service';
import { ManagedDeviceRepository } from '../../repositories';

class Status {
  API: boolean;
  ZabbixAPI: boolean;
  SalesforceAPI: boolean;
}

@Tags('Diagnostics')
@Path('')
export class RootController {
  @Inject()
  private salesForceService: SalesForceAuthenticationService;

  @Inject()
  private zabbixService: ZabbixService;

  @Inject()
  private logService: LogService;

  @Inject()
  private repository: ManagedDeviceRepository;

  constructor() {
  }

  @GET
  @Path('/ping')
  public ping(): boolean {
    return true;
  }

  @GET
  @Path('/status')
  public async status(): Promise<Status> {
    const status = {
      API: true,
      ZabbixAPI: false,
      SalesforceAPI: false,
      Database: false,
      Version: process.env.VERSION
    };

    try {
      const zabbix = this.zabbixService.status()
        .then(
          response => status.ZabbixAPI = !!response.id,
          error => status.ZabbixAPI = false);

      const salesForce = this.salesForceService.status()
        .then(
          response => status.SalesforceAPI = !!response.Connected,
          error => status.SalesforceAPI = false);
      const allResults = await Promise.all([zabbix, salesForce]);
    } catch (e) {
      this.logService.error('Unable to get status from Zabbix', null, e);
    }

    try {
      await (await this.repository.getOrm()).count();
      status.Database = true;
    } catch (e) {
      this.logService.error('Unable to talk to database', null, e);
    }

    return status;
  }
}
