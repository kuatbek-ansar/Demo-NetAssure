import * as appInsights from 'applicationinsights';
import { Inject } from 'typedi';

import { Notification } from '../../../models';
import { ZabbixTriggerService, LogService } from '../../services';
import { Path, GET, PathParam, QueryParam, Errors } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';
import { ZabbixNotificationStatusEnum, ZabbixNotificationSeverityEnum } from '../../../models/';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Notifications')
@Path('/notification')
export class NotificationController {
  @Inject()
  private zabbixTriggerService: ZabbixTriggerService;

  @Inject()
  private logService: LogService;

  constructor() {
  }

  @GET
  @Path('/get/:groupId')
  public async getByGroupId(@PathParam('groupId') groupId: number,
    @QueryParam('severity') severity: string,
    @QueryParam('minimumSeverity') minimumSeverity: string,
    @QueryParam('values') values: string): Promise<Notification[]> {
    try {
      return this.zabbixTriggerService.getByGroupId(groupId,
        this.parseSeverity(minimumSeverity),
        this.parseStatus(values),
        this.parseSeverity(severity))
    } catch (e) {
      appInsights.defaultClient.trackException({
        exception: e,
        properties: {
          class: 'NotificationController',
          method: 'getByGroupId',
          params: JSON.stringify({
            groupId: groupId,
            severity: severity,
            minimumSeverity: minimumSeverity,
            values: values
          })
        }
      });
      this.logService.error('Unable to get notification by group id',
        { groupId: groupId, severity: severity, minimumSeverity: minimumSeverity, values: values }, e);
      throw new Errors.InternalServerError();
    }
  }

  @GET
  @Path('/get/:groupId/:deviceId')
  public async getByDeviceId(@PathParam('groupId') groupId: number,
    @PathParam('deviceId') deviceId: number,
    @QueryParam('severity') severity: string,
    @QueryParam('minimumSeverity') minimumSeverity: string,
    @QueryParam('values') values: string): Promise<Notification[]> {
    try {
      return this.zabbixTriggerService.getByDeviceId(deviceId,
        groupId,
        this.parseSeverity(minimumSeverity),
        this.parseStatus(values),
        this.parseSeverity(severity));
    } catch (e) {
      appInsights.defaultClient.trackException({
        exception: e,
        properties: {
          class: 'NotificationController',
          method: 'getByDeviceId',
          params: JSON.stringify({
            deviceId: deviceId,
            groupId: groupId,
            severity: severity,
            minimumSeverity: minimumSeverity,
            values: values
          })
        }
      });
      this.logService.error('Unable to get notifications by device id',
        { deviceId: deviceId, severity: severity, minimumSeverity: minimumSeverity, values: values }, e);
      throw new Errors.InternalServerError();
    }
  }

  private parseStatus(status): ZabbixNotificationStatusEnum {
    if (!status) {
      return ZabbixNotificationStatusEnum.Any;
    } else if (status === '1') {
      return ZabbixNotificationStatusEnum.Alert;
    } else if (status === '0') {
      return ZabbixNotificationStatusEnum.Clear;
    } else {
      return ZabbixNotificationStatusEnum.Any;
    }

  }

  private parseSeverity(severity): ZabbixNotificationSeverityEnum {
    if (!severity) {
      return ZabbixNotificationSeverityEnum.Any;
    } else if (severity === '0') {
      return ZabbixNotificationSeverityEnum.NotClassified
    } else if (severity === '1') {
      return ZabbixNotificationSeverityEnum.Information
    } else if (severity === '2') {
      return ZabbixNotificationSeverityEnum.Warning
    } else if (severity === '3') {
      return ZabbixNotificationSeverityEnum.Average
    } else if (severity === '4') {
      return ZabbixNotificationSeverityEnum.High
    } else if (severity === '5') {
      return ZabbixNotificationSeverityEnum.Disaster
    }
  }
}
