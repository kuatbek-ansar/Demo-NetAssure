export class SalesforceAuth {
  public AccessToken: string;

  public InstanceUrl: string;

  public UserId: string;

  public ContactId: string;

  public IsSuperUser: boolean;

  public UserGroups: string[];

  constructor(init: any = {}) {
    init.UserId = init.UserId || init.id;
    init.ContactId = init.ContactId || init.contact_id;
    init.AccessToken = init.AccessToken || init.access_token;
    init.InstanceUrl = init.InstanceUrl || init.instance_url;
    init.IsSuperUser = init.IsSuperUser || init.SuperUser;

    Object.assign(this, {
      'UserId': init.UserId,
      'ContactId': init.ContactId,
      'AccessToken': init.AccessToken,
      'InstanceUrl': init.InstanceUrl,
      'IsSuperUser': init.IsSuperUser,
      'UserGroups': init.UserGroups
    });
  }
}
