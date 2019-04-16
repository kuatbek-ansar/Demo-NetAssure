import { Circuit } from './circuit.model';

export class Iface {
  public readonly ownerAccountId: string;

  public readonly hostId: string;

  public readonly itemId: string;

  public displayName: string;

  public circuits: Circuit[];

  constructor(init: any = {}) {
    this.ownerAccountId = init.ownerAccountId || init.owneraccountid;
    this.hostId = init.hostId || init.hostid;
    this.itemId = init.itemId || init.itemid;
    this.displayName = init.displayName || init.nameclean;
    this.circuits = init.Circuits;
  }

  public get ifaceId(): string {
    return `${this.hostId}${this.itemId}`
  }
}
