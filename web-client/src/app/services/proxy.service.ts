import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { ProxyCost } from '../../../models';

@Injectable()
export class ProxyService extends HttpService {
    constructor(
        private injector: Injector) {
        super(injector);
    }

    public getCurrentProxiesForGroup(groupId: string): Observable<Array<ProxyCost>> {
        return super.get(`${this.ApiUrls.Proxies}/${groupId}`);
    }

}
