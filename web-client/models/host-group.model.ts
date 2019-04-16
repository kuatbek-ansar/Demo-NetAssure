export enum ZabbixHostGroupOrigin {
  plain = 0,
  discovery = 4
}

export class HostGroup {
  public Id: string;

  public Name: string;

  public Origin: ZabbixHostGroupOrigin;

  public UsedInternally: boolean;

  constructor(init: any = {}) {
    Object.assign(this, {
      Id: init.Id || init.id,
      Name: init.Name || init.name,
      Origin: init.origin || ZabbixHostGroupOrigin[init.flags],
      UsedInternally: !!init.usedInternally || !!init.internal
    });
  }
}
