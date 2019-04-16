import { HttpService } from './http.service';
import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NotificationTypeViewModel } from '../models/index';

@Injectable()
export class NotificationTypeService extends HttpService {
    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    public getAll(): Observable<Array<NotificationTypeViewModel>> {
        return super.get(`${this.ApiUrls.NotificationTypes}`);
    }
}
