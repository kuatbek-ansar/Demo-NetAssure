import { HttpService } from './http.service';
import { Injector, Injectable } from '@angular/core';
import { AlertGroupViewModel } from '../models/alert-group.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AlertGroupsService extends HttpService {
    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    public getAll(): Observable<Array<AlertGroupViewModel>> {
        return super.get(`${this.ApiUrls.AlertGroups}`);
    }

    public getOne(id: number): Observable<AlertGroupViewModel> {
        return super.get(`${this.ApiUrls.AlertGroups}/${id}`);
    }

    public save(alertGroup): Observable<AlertGroupViewModel> {
        return super.post(`${this.ApiUrls.AlertGroups}`, alertGroup);
    }

    public delete(id): Observable<AlertGroupViewModel> {
        return super.delete(`${this.ApiUrls.AlertGroups}/${id}`);
    }
}
