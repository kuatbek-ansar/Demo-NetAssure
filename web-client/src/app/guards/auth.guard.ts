import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { StateService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private state: StateService) {
  }

  canActivate() {
    if (this.state.User.IsAuthenticated) {
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }
}
