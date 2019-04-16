import { Device } from '../../../models/device.model';

export class DeviceViewModel extends Device {
  public IsSelected: boolean;
  public HasActiveNotifications: boolean;

  public disableManagementButton = false;

  public constructor() {
    super();
    this.HasActiveNotifications = false;
  }
}
