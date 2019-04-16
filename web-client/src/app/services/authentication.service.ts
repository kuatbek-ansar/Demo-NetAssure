import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { StateService } from './state.service';
import { UsernamePassword } from '../../../models';
import '../../rxjs-imports';

@Injectable()
export class AuthenticationService extends HttpService {
  constructor(
    private injector: Injector,
    private stateService: StateService
  ) {
    super(injector);
  }

  public Login(user: UsernamePassword): Observable<void> {
    return super.post(this.ApiUrls.Login, user)
      .do((data: Response) => {
          this.stateService.SetUser(data);
      })
      .catch((r: HttpErrorResponse) => Observable.throw(r.error));
  }

  public ResetPassword(user: UsernamePassword): Observable<any> {
    return super.post(this.ApiUrls.ResetPassword, user)
      .catch((r: HttpErrorResponse) => Observable.throw(r.error));
  }

  public SetPassword(username: string, newPassword: string): Observable<any> {
    return super.post(this.ApiUrls.SetPassword, { Username: username, Password: newPassword })
    .catch((r: HttpErrorResponse) => Observable.throw(r.error));
  }

  Logout(): void {
    this.stateService.ClearUser();
  }
}
