import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { HttpService } from './http.service';

@Injectable()
export class FeatureTogglesService extends HttpService {
    constructor(private injector: Injector) {
        super(injector);
    }

    public toggleIsEnabled(name: string): Observable<boolean> {
        return super.get(`${this.ApiUrls.GetToggleState}/${name}`);
    }
}
