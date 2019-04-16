import { Injectable, Injector } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/Observable';
import { DeviceInterface } from '../../../models/device-interface.model';

@Injectable()
export class DeviceInterfaceService extends HttpService {
  constructor(private injector: Injector) {
    super(injector);
  }

  getAll(): Observable<DeviceInterface[]> {
    return super.get(`${this.ApiUrls.Interfaces}`);
  }
}
