import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Account, User } from '../../../models';

@Injectable()
export class StateService {
  public User: User;

  public Token: string;

  public AccountStateChanged$: Observable<Account>;
  private accountStateChanged: Subject<Account>;

  public Loading$: Observable<boolean>;
  private loadingChanged: Subject<boolean>;

  public UserStateChanged$: Observable<User>;
  private userStateChanged: Subject<User>;

  public TokenChanged$: Observable<String>;
  private tokenChanged: Subject<string>;

  constructor() {
    this.accountStateChanged = new Subject<Account>();
    this.loadingChanged = new Subject<boolean>();
    this.tokenChanged = new Subject<string>();
    this.userStateChanged = new Subject<User>();

    this.AccountStateChanged$ = this.accountStateChanged.asObservable();
    this.Loading$ = this.loadingChanged.asObservable();
    this.TokenChanged$ = this.tokenChanged.asObservable();
    this.UserStateChanged$ = this.userStateChanged.asObservable();

    this.GetUser();
  }

  public Working(): void {
    this.loadingChanged.next(true);
  }

  public Ready(): void {
    this.loadingChanged.next(false);
  }

  public GetToken(): string {
    return localStorage.getItem('Token');
  }

  public GetUser() {
    this.User = new User();

    if (localStorage.getItem('User')) {
      this.User = <User>JSON.parse(localStorage.getItem('User'));
      this.Token = this.GetToken();
    }
  }

  public SetUser(data: any) {
    this.User = data.User as User;
    this.Token = data.Token;

    localStorage.setItem('User', JSON.stringify(this.User));
    localStorage.setItem('Token', this.Token);

    this.userStateChanged.next(this.User);
    this.tokenChanged.next(this.Token);
  }

  public SetAccount(account: Account) {
    this.User.Account = account;

    localStorage.setItem('User', JSON.stringify(this.User));

    this.accountStateChanged.next(this.User.Account);
  }

  public ClearUser() {
    this.Token = null;
    this.User.IsAuthenticated = false;

    localStorage.removeItem('User');
    localStorage.removeItem('Token');

    this.userStateChanged.next(this.User);
    this.tokenChanged.next(this.Token);
  }
}
