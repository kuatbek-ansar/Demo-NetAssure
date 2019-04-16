import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class ApiErrorService {
  protected errorObserver: Observer<any>;
  public apiErrors: Observable<any>;

  constructor() {
    this.apiErrors = new Observable<any>(observer => {
      this.errorObserver = observer
    });
  }

  public HandleError(error: any): Observable<any> {
    this.errorObserver.next(error);
    return Observable.throw(error);
  }
}
