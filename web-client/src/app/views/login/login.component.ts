import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

import { AuthenticationService, StateService } from '../../services';
import { UsernamePassword } from '../../../../models';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: [
    'login.component.css',
    '../../../../node_modules/ladda/dist/ladda-themeless.min.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  public User: UsernamePassword;

  public IsLoading = false;

  public HasErrors = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private state: StateService,
    private toasterService: ToasterService
  ) {
    this.User = new UsernamePassword();
  }

  ngOnInit() {
    if (this.state.User) {
      this.authService.Logout();
    }
  }

  Login() {
    this.toasterService.clear();

    if (this.User.Username && this.User.Password) {
      this.IsLoading = true;

      this.authService.Login(this.User)
        .subscribe((response: any) => {
          if (response.User.PasswordExpired) {
            this.toasterService.pop('error', 'Password Expired', 'You are required to set a new password before continuing');
            setTimeout(() => {
              this.router.navigate(['/login/setPassword']);
            }, 2000);
            this.IsLoading = false;
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, (error: string) => {
          this.toasterService.pop('error', 'Login Failed', 'Check username and password');
          this.IsLoading = false;
          this.HasErrors = true;
        });
    }
  }
}
