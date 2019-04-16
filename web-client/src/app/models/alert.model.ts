import { ManagedDeviceViewModel, AlertGroupViewModel, NotificationTypeViewModel } from './index';

export class AlertViewModel {
    id: number;
    name: string;
    severity: number;
    managedDevices: Array<ManagedDeviceViewModel>;
    alertGroups: Array<AlertGroupViewModel>;
    notifications: Array<NotificationTypeViewModel>;
}
