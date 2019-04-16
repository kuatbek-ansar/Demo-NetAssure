export class Account {
  public readonly Name: string;

  public readonly Id: string;

  public readonly GroupName: string;

  public readonly GroupId: string;

  constructor(init: any = {}) {
    this.Name = init.name;
    this.Id = init.accountId;
    this.GroupName = init.groupName;
    this.GroupId = init.groupId;
  }
}
