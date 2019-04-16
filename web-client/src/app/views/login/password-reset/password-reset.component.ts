import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

import { AuthenticationService, StateService } from '../../../services';
import { UsernamePassword } from '../../../../../models';

@Component({
  templateUrl: 'password-reset.component.html',
  styleUrls: [
    'password-reset.component.css',
    '../../../../../node_modules/ladda/dist/ladda-themeless.min.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class PasswordResetComponent implements OnInit {
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

  Reset() {
    this.toasterService.clear();

    if (this.User.Username) {
      this.IsLoading = true;
      this.authService.ResetPassword(this.User)
        .subscribe(() => {
          this.toasterService.pop('success', 'Password Has Been Reset', `Temporary password emailed to the email address on file.`);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
          this.IsLoading = false;
        }, (error: string) => {
          this.toasterService.pop('error', 'Password Reset Failed', error);
          this.IsLoading = false;
          this.HasErrors = true;
        });
    }
  }
}
