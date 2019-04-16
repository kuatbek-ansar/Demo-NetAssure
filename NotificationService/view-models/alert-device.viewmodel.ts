import { Alert, AlertGroup, ManagedDevice, Notification } from '../models';

export class AlertDeviceViewModel extends Alert {
    managedDevices: ManagedDevice[];

    notifications: Notification[];

    alertGroups: AlertGroup[];
}
