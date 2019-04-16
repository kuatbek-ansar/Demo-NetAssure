import { Service } from 'typedi';
import { HttpService } from './http.service';
import { LogService } from './log.service';
import { ConfigService } from './config.service';
import { Config } from '../config';

@Service()
export class ZabbixService {
  private config: Config;
  public authToken: string;
  private MACRO_NAME = '{$AFFMNGD}';
  constructor(
    private httpService: HttpService,
    private log: LogService,
    private configService: ConfigService
  ) {
    this.config = configService.GetConfiguration();
  }

  private async login(): Promise<void> {
    const body = {
      jsonrpc: '2.0',
      method: 'user.login',
      params: {
        user: this.config.zabbix.userName,
        password: this.config.zabbix.password
      },
      'id': 1
    };

    if (!this.authToken) {
      try {
        this.log.debug('Calling Zabbix user.login for login', { url: this.config.zabbix.apiUrl, body: body });
        const data = await this.httpService.post(this.config.zabbix.apiUrl, body);
        this.authToken = data.result;
      } catch (e) {
        this.log.error('Error logging into zabbix', null, e);
      }
    }
  }

  public async post(method: string, params: any): Promise<any> {
    await this.login();

    const body = {
      jsonrpc: '2.0',
      method: method,
      id: 1,
      auth: this.authToken,
      params
    };
    this.log.debug(`Calling Zabbix ${method} for post`, { url: this.config.zabbix.apiUrl, body: body });
    return this.httpService.post(this.config.zabbix.apiUrl, body);
  }

  public async status(): Promise<any> {
    const body = {
      jsonrpc: '2.0',
      method: 'apiinfo.version',
      id: 1,
      params: {}
    };

    this.log.debug('Calling Zabbix apiinfo.version for status', { url: this.config.zabbix.apiUrl, body: body });
    return this.httpService.post(this.config.zabbix.apiUrl, body);
  }

  public async setManaged(hostId: string, isManaged: boolean) {
    await this.login();

    const body = {
      jsonrpc: '2.0',
      method: 'host.update',
      id: 1,
      auth: this.authToken,
      params: {
        hostid: hostId,
        macros: [
          {
            macro: this.MACRO_NAME,
            value: isManaged ? '1' : '0'
          }
        ]
      }
    };

    this.log.debug('Calling Zabbix host.update for setManaged', { url: this.config.zabbix.apiUrl, body: body });
    return await this.httpService.post(this.config.zabbix.apiUrl, body);
  }

  public async setSnmpCommunityString(hostId: string, community: string) {
    await this.login();

    const removeCommunityStringBody = {
      jsonrpc: '2.0',
      method: 'host.massremove',
      id: 1,
      auth: this.authToken,
      params: {
        hosts: [{ hostid: hostId }],
        macros: '{$SNMP_COMMUNITY}'
      }
    };

    this.log.debug('Calling Zabbix host.massremove for setSnmpCommunityString',
      { url: this.config.zabbix.apiUrl, body: removeCommunityStringBody });
    await this.httpService.post(this.config.zabbix.apiUrl, removeCommunityStringBody);

    if (community) {
      const addCommunityStringBody = {
        jsonrpc: '2.0',
        method: 'host.massadd',
        id: 1,
        auth: this.authToken,
        params: {
          hosts: [{ hostid: hostId }],
          macros: [
            {
              macro: '{$SNMP_COMMUNITY}',
              value: community
            }
          ]
        }
      };
      this.log.debug('Calling Zabbix host.massadd for setSnmpCommunityString',
        {
          url: this.config.zabbix.apiUrl, body: addCommunityStringBody
        });
      await this.httpService.post(this.config.zabbix.apiUrl, addCommunityStringBody);
    }

  }
}
