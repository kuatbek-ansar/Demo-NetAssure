import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { Host } from '../../../models';

@Injectable()
export class DeviceService extends HttpService {
  constructor(
    private injector: Injector) {
    super(injector);
  }

  public get() {
    return super.get(this.ApiUrls.GetHosts);
  }

  public getDevice(device_id: string): Observable<Host[]> {
    const hosts: Observable<Host[]> = super.get(`${this.ApiUrls.GetHosts}/${device_id}`);

    return hosts.map((host) => {
      return host;
    })
  }

  public update(device): Observable<void> {
    return super.put(this.ApiUrls.UpdateHost, device);
  }
}
