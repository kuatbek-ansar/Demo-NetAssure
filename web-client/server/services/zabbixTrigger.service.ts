import { Service } from 'typedi';
import { ZabbixService } from './zabbix.service';
import { Notification, ZabbixHostGroupOrigin } from '../../models';
import { ZabbixNotificationStatusEnum, ZabbixNotificationSeverityEnum } from '../../models/';
import { LogService } from './log.service';

@Service()
export class ZabbixTriggerService {
  baseParams = {
    active: true,
    output: 'extend',
    selectHosts: 'extend',
    sortfield: 'lastchange',
    sortorder: 'DESC'
  };

  constructor(private zabbixService: ZabbixService, private log: LogService) {
  }

  public async getByGroupId(groupId: number,
    minimumSeverity: ZabbixNotificationSeverityEnum,
    status: ZabbixNotificationStatusEnum,
    severity: ZabbixNotificationSeverityEnum): Promise<Notification[]> {
    const filter = this.getFilter(status, severity);


    const params = {
      groupids: groupId,
      filter: filter,
      min_severity: minimumSeverity,
      ...this.baseParams
    };

    try {
      this.log.debug('Calling Zabbix trigger.get for getByGroupId', {params: params});
      const zabbixResponse = await this.zabbixService.post('trigger.get', params);
      const notifications: Notification[] = zabbixResponse.result
        .map(item => new Notification(item));

      return notifications;
    } catch (e) {
      this.log.error('Unable to get zabbix triggers by group', { groupId: groupId }, e);
    }
  }

  public async getByDeviceId(deviceId: number,
    groupId: number,
    minimumSeverity: ZabbixNotificationSeverityEnum,
    status: ZabbixNotificationStatusEnum,
    severity: ZabbixNotificationSeverityEnum): Promise<Notification[]> {
    const filter = this.getFilter(status, severity);


    const params = {
      groupids: groupId,
      hostids: deviceId,
      filter: filter,
      min_severity: minimumSeverity,
      ...this.baseParams
    };

    try {
      this.log.debug('Calling Zabbix trigger.get for getByDeviceId', {params: params});
      const zabbixResponse = await this.zabbixService.post('trigger.get', params);
      const notifications: Notification[] = zabbixResponse.result
        .map(item => new Notification(item));

      return notifications;

    } catch (e) {
      this.log.error('Unable to get zabbix device by Id', { groupId: groupId, deviceId: deviceId }, e);
    }
  }

  private getFilter(status: ZabbixNotificationStatusEnum, severity) {
    const filter: any = { value: ['0', '1'] };
    if (status === ZabbixNotificationStatusEnum.Clear) {
      filter.value = '0';
    } else if (status === ZabbixNotificationStatusEnum.Alert) {
      filter.value = '1'
    }
    if (severity === ZabbixNotificationSeverityEnum.NotClassified) {
      filter.priority = 0;
    } else if (severity === ZabbixNotificationSeverityEnum.Information) {
      filter.priority = 1;
    } else if (severity === ZabbixNotificationSeverityEnum.Warning) {
      filter.priority = 2;
    } else if (severity === ZabbixNotificationSeverityEnum.Average) {
      filter.priority = 3;
    } else if (severity === ZabbixNotificationSeverityEnum.High) {
      filter.priority = 4;
    } else if (severity === ZabbixNotificationSeverityEnum.Disaster) {
      filter.priority = 5;
    }
    return filter;
  }
}
