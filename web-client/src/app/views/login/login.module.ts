import { NgModule } from '@angular/core';

import { LaddaModule } from 'angular2-ladda';
import { GlobalModule } from '../../global.module';

import { LoginComponent } from './login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { LoginRoutingModule } from './login-routing.module';
import { PasswordSetComponent } from './password-set/password-set.component';

@NgModule({
  imports: [
    GlobalModule,
    LoginRoutingModule,
    LaddaModule
  ],
  declarations: [
    LoginComponent,
    PasswordResetComponent,
    PasswordSetComponent
  ],
  providers: [
  ]
})
export class LoginModule {
}
