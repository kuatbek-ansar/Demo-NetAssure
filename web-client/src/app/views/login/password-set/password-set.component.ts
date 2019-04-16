import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, StateService } from '../../../services';
import { User } from '../../../../../models';
import { ToasterConfig, ToasterService } from 'angular2-toaster';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    templateUrl: 'password-set.component.html',
    styleUrls: [
        'password-set.component.css',
        '../../../../../node_modules/ladda/dist/ladda-themeless.min.css'
    ],
    encapsulation: ViewEncapsulation.None
})
export class PasswordSetComponent implements OnInit, AfterViewInit {
    public NewPassword = '';
    public Confirmation = '';

    public IsLoading = false;
    public HasErrors = false;
    public NoUsername = true;

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private state: StateService,
        private toasterService: ToasterService
    ) { }

    ngOnInit() {
        if (this.state.User && this.state.User.Username) {
            this.NoUsername = false;
        }
    }

    ngAfterViewInit(): void {
        this.toasterService.clear();
        if (this.NoUsername) {
            this.toasterService.pop('error', 'Unable to set new password', 'You must be logged in before being able to set a new password');
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 5000);
        }
    }

    SetPassword() {
        this.HasErrors = false;
        this.toasterService.clear();

        if (this.NewPassword && this.Confirmation) {
            this.IsLoading = true;

            if (this.NewPassword !== this.Confirmation) {
                this.toasterService.pop('error', 'Passwords Dont\'t Match', 'The passwords must match exactly');
                this.IsLoading = false;
                this.HasErrors = true;
                return;
            }

            this.authService.SetPassword(this.state.User.Username, this.NewPassword)
                .subscribe(() => {
                    this.toasterService.pop('success',
                        'Password Has Been Updated',
                        `You will now be redirected to login with your new password.`);
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 5000);
                    this.IsLoading = false;
                }, (error: string) => {
                    this.toasterService.pop('error', 'Password Update Failed', error);
                    this.IsLoading = false;
                    this.HasErrors = true;
                });
        }
    }
}
