import { HttpService } from './http.service';
import { Injector, Injectable } from '@angular/core';
import { AlertGroupViewModel } from '../models/alert-group.model';
import { Observable } from 'rxjs/Observable';
import { GlobalSNMPConfig, DeviceSNMPConfig } from '../../../models/index';

@Injectable()
export class SNMPConfigService extends HttpService {
    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    public getDevice(id: string): Observable<DeviceSNMPConfig> {
        return super.get(`${this.ApiUrls.SNMPDevice}/${id}`);
    }

    public saveDevice(id: string, model: DeviceSNMPConfig): Observable<DeviceSNMPConfig> {
        return super.post(`${this.ApiUrls.SNMPDevice}/${id}`, model);
    }

    public getGlobal(): Observable<GlobalSNMPConfig> {
        return super.get(`${this.ApiUrls.SNMPGlobal}`);
    }

    public saveGlobal(model: GlobalSNMPConfig): Observable<GlobalSNMPConfig> {
        return super.post(`${this.ApiUrls.SNMPGlobal}`, model);
    }
}
