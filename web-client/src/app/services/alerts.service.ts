import { HttpService } from './http.service';
import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AlertViewModel } from '../models/index';

@Injectable()
export class AlertsService extends HttpService {
    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    public getAll(): Observable<Array<AlertViewModel>> {
        return super.get(`${this.ApiUrls.Alerts}`);
    }

    public getOne(id: number): Observable<AlertViewModel> {
        return super.get(`${this.ApiUrls.Alerts}/${id}`);
    }

    public save(alert): Observable<AlertViewModel> {
        return super.post(`${this.ApiUrls.Alerts}`, alert);
    }

    public delete(id): Observable<AlertViewModel> {
        return super.delete(`${this.ApiUrls.Alerts}/${id}`);
    }
}
