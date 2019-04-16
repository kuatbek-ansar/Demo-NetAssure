import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { Host } from '../../../models';

@Injectable()
export class InvoiceService extends HttpService {
    constructor(
        private injector: Injector) {
        super(injector);
    }

    public getAll() {
        return super.get(this.ApiUrls.Invoices);
    }

    public getByGroupId(groupId: string) {
      return super.get(`${this.ApiUrls.InvoicesByGroup}/${groupId}`);
  }

    public getInvoice(id: string) {
        return super.get(`${this.ApiUrls.Invoices}/${id}`);
    }

    public saveInvoice(groupId: string, date: string) {
        return super.post(this.ApiUrls.Invoices, { groupId: groupId, date: new Date(date) });
    }

    public getGroupsWithPostalCodes() {
        return super.get(`${this.ApiUrls.CustomerPostalCodes}/`);
    }

    public download(id: string) {
        return super.get(`${this.ApiUrls.Invoices}/${id}/pdf`, { responseType: 'blob' });
    }
}
