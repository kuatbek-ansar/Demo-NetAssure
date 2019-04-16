import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { DeviceManagementHistory } from '../../../models';
import { HttpService } from './http.service';

@Injectable()
export class DeviceManagementHistoryService extends HttpService {
  constructor(private injector: Injector) {
    super(injector);
  }

  public getAll(): Observable<DeviceManagementHistory[]> {
    return super.get(this.ApiUrls.ManagedDeviceHistory);
  }

  public createEntry(managedDevice: DeviceManagementHistory) {
    return super.post(`${this.ApiUrls.ManagedDeviceHistory}`, managedDevice);
  }

  public update(managedDevice: DeviceManagementHistory) {
    return super.put(`${this.ApiUrls.ManagedDeviceHistory}/host/${managedDevice.host_id}`, managedDevice);
  }

  public remove(managedDevice_id) {
    return super.delete(`${this.ApiUrls.ManagedDeviceHistory}/${managedDevice_id}`);
  }

}
