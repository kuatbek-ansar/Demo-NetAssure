import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';

@Injectable()
export class HistoryService extends HttpService {
  constructor(
    private injector: Injector
  ) {
    super(injector);
  }

  getForItem(items): Observable<any[]> {
    return super.post(this.ApiUrls.GetHistoryForItem, items)
  }
}
