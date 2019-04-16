import 'reflect-metadata';

import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { Container } from 'typedi';

import {
    AlertApiData,
    AlertGroup,
    AlertGroupMember,
    ApiFailurePayload,
    ApiSuccessPayload,
    Message,
    Notification,
    NotificationPayload,
    NotificationSeverity,
    ZabbixSeverity
} from './models';
import { AlertGroupService, AlertService, AwsSnsService, LogService } from './services';
import { AlertDeviceViewModel } from './view-models';

export const notify: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
    const alertService: AlertService = Container.get(AlertService);
    const alertGroupService: AlertGroupService = Container.get(AlertGroupService);
    const notificationService: AwsSnsService = Container.get(AwsSnsService);
    const logService: LogService = Container.get(LogService);
    let alertApiData: AlertApiData;

    try {
        const payload = JSON.parse(event.body) as NotificationPayload;
        const zabbixSeverity = Object.keys(ZabbixSeverity).filter(x => ZabbixSeverity[x] === payload.severity);
        const severity = NotificationSeverity[Object.keys(NotificationSeverity).filter(x => x === zabbixSeverity.toString())[0]];
        const responseData: any[] = [];

        logService.Debug('Parameters', {
            ItemId: payload.item_id,
            Name: payload.name,
            Description: payload.description,
            ZabbixSeverity: zabbixSeverity,
            Severity: severity
        });

        alertApiData = await alertService.GetByItemId(payload.item_id, severity);

        for (let i = 0; i < alertApiData.Alerts.length; i++) {
            const alert: AlertDeviceViewModel = alertApiData.Alerts[i];
            const notifications = alert.notifications;

            for (let j = 0; j < notifications.length; j++) {
                const n: Notification = notifications[j];
                const isMatch = new RegExp(n.matchRegex, 'ig').test(payload.name)
                    || new RegExp(n.matchRegex, 'ig').test(payload.description);

                logService.Debug('Notification', {
                    Id: n.id, Regex: n.matchRegex, Match: isMatch
                });

                if (isMatch) {
                    const alertGroups: AlertGroup[] = alert.alertGroups;

                    for (let k = 0; k < alertGroups.length; k++) {
                        const alertGroup: AlertGroup = alertGroups[k];
                        const alertGroupApiData = await alertGroupService.GetById(alertGroup.id);

                        if (alertGroupApiData.Error) {
                            cb(alertGroupApiData.Error, new ApiFailurePayload(alertGroupApiData.Error));
                            return;
                        }

                        const members = alertGroupApiData.AlertGroups.members;

                        for (let l = 0; l < members.length; l++) {
                            const member: AlertGroupMember = members[l];

                            const response = await notificationService.Send(
                                new Message(member.notificationMethod, payload.name, member.address, payload.description)
                            );

                            responseData.push(response);
                        }
                    }
                }
            }
        }

        context.succeed(new ApiSuccessPayload(responseData));
    } catch (error) {
        context.fail(error);
    }
};
