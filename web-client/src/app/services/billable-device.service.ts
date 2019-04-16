import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { ManagedDeviceCost } from '../../../models';

@Injectable()
export class BillableDeviceService extends HttpService {
    constructor(
        private injector: Injector) {
        super(injector);
    }

    public getBillableDevices(groupId: string, date: string): Observable<Array<ManagedDeviceCost>> {
        if (! /\d{4}-\d{2}-\d{2}/.test(date)) {
            throw new Error('Invalid date format');
        }
        return super.get(`${this.ApiUrls.BillableDevices}/${groupId}/${date}`);
    }

}
