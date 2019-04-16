export class Record {
  public readonly OwnerAccountId: string;

  public readonly Id: string;

  public Path: string;

  public Name: string;

  constructor(init: any = {}) {
    this.OwnerAccountId = init.OwnerAccountId;
    this.Id = init.Id || init.record_id;
    this.Path = init.path;
    this.Name = init.name;
  }
}
