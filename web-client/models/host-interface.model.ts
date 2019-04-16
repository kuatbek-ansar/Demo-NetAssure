export const enum HostInterfaceType {
  'agent' = 1,
  'snmp' = 2,
  'ipmi' = 3,
  'jmx' = 4
}

export class HostInterface {
  public hostInterfaceId: string;

  public dnsName: string;

  public hostId: string;

  public ipAddress: string;

  public isPrimaryInterface: boolean;

  public port: string;

  public type: HostInterfaceType;

  public shouldConnectViaIp: boolean;

  public shouldUseBulkSnmpRequests: boolean;

  constructor(init: any = {}) {
    this.hostInterfaceId = init.hostInterfaceId || init.interfaceid;
    this.dnsName = init.dnsName || init.dns;
    this.hostId = init.hostId || init.hostid;
    this.ipAddress = init.ipAddress || init.ip;
    this.isPrimaryInterface = init.isPrimaryInterface || (init.main === 1);
    this.shouldConnectViaIp = init.shouldConnectViaIp || (init.useip === 1);
    this.shouldUseBulkSnmpRequests = init.shouldUseBulkSnmpRequests || (init.bulk === 1);

    switch (init.type) {
      case 1:
      case '1':
      case 'agent':
      case HostInterfaceType.agent:
        this.type = HostInterfaceType.agent;
        break;
      case 2:
      case '2':
      case 'snmp':
      case HostInterfaceType.snmp:
        this.type = HostInterfaceType.snmp;
        break;
      case 3:
      case '3':
      case 'ipmi':
      case HostInterfaceType.ipmi:
        this.type = HostInterfaceType.ipmi;
        break;
      case 4:
      case '4':
      case 'jmx':
      case HostInterfaceType.jmx:
        this.type = HostInterfaceType.jmx;
        break;
    }
  }
}
