import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiErrorService, AuthenticationService, StateService } from '../../services';

@Component({
  selector: 'app-relogin',
  template: '<div class="errors"></div>'
})
export class AppReloginComponent {
  error: any;
  busy: boolean;
  constructor(
    apiErrorService: ApiErrorService,
    private authService: AuthenticationService,
    private router: Router,
    private state: StateService,
  ) {
    const component = this;
    this.busy = false;
    apiErrorService.apiErrors.subscribe( error => {
      if (error && error.status === 401) {
        component.reloadLoginToken();
      }
    });
  }

  public reloadLoginToken() {
    if (this.busy) {
      return;
    }
    this.busy = true;

    // TODO - come up with a secure way to re-issue a token...

    this.state.ClearUser();
    this.router.navigate(['/']);
  }

}
