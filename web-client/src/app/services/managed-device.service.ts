import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { DeviceCount } from '../models';
import { HttpService } from './http.service';
import { ManagedDevice } from '../../../models';

@Injectable()
export class ManagedDeviceService extends HttpService {
  constructor(private injector: Injector) {
    super(injector);
  }

  public getManagedDevice(host_id) {
    return super.get(`${this.ApiUrls.ManagedDevice}/host/${host_id}`);
  }

  public getAll(): Observable<ManagedDevice[]> {
    return super.get(this.ApiUrls.ManagedDevice) as Observable<ManagedDevice[]>;
  }

  public getCount(): Observable<DeviceCount> {
    return super.get(`${this.ApiUrls.ManagedDevice}/counts`) as Observable<DeviceCount>;
  }

  public createEntry(managedDevice: ManagedDevice) {
    return super.post(this.ApiUrls.ManagedDevice, managedDevice);
  }

  public update(managedDevice: ManagedDevice) {
    return super.put(`${this.ApiUrls.ManagedDevice}/host/${managedDevice.host_id}`, managedDevice);
  }

  public remove(managedDevice_id) {
    return super.delete(`${this.ApiUrls.ManagedDevice}/${managedDevice_id}`);
  }
}
