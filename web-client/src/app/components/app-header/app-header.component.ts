import { Component, OnInit } from '@angular/core';

import { Account, User } from '../../../../models';
import { StateService } from '../../services';

@Component({
  selector: 'app-header',
  templateUrl: 'app-header.component.html'
})
export class AppHeaderComponent implements OnInit {
  public User: User;

  constructor(private state: StateService) {
    this.User = this.state.User;
  }

  public ngOnInit() {
    this.state.UserStateChanged$.subscribe((user: User) => {
      this.User = user;
    });
  }

  public onChangeAccount(account: Account): boolean {
    this.state.SetAccount(account);

    return false;
  }
}
