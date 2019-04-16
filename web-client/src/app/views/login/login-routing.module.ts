import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordSetComponent } from './password-set/password-set.component';

const routes: Routes = [
  {
    path: 'reset',
    component: PasswordResetComponent,
    data: {
      title: 'Password Reset'
    }
  },
  {
    path: 'setPassword',
    component: PasswordSetComponent,
    data: {
      title: 'Set Password'
    }
  },
  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
