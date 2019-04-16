import { Account } from './account.model';
import { HostGroup } from './host-group.model';
import { SalesforceAuth } from './salesforce-auth.model';

export class UsernamePassword {
  public Username: string;
  public Password: string;
}

export class User {
  public Account: Account;

  public Accounts: Account[];

  public HostGroup: HostGroup;

  public SalesforceAuth: SalesforceAuth;

  public Username: string;

  public Password: string;

  public IsAuthenticated: boolean;

  public EmailAddress: string;

  public PasswordExpired: boolean;

  constructor(init: any = {}) {
    this.Account = init.Account;
    this.HostGroup = new HostGroup(init.HostGroup || init.hostGroup);
    this.IsAuthenticated = init.IsAuthenticated || false;
    this.Password = init.Password;
    this.SalesforceAuth = new SalesforceAuth(init.SalesforceAuth || init.salesforceAuth);
    this.Username = init.Username;
    this.EmailAddress = init.EmailAddress;
    this.PasswordExpired = init.PasswordExpired || false;
  }
}
