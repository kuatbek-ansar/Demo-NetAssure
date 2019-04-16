export class ZabbixHostGroupMappingEnvelope {
    public result: ZabbixHostGroupMapping[];
}

export class ZabbixHostGroupMapping {
    public hostid: string;
    public groups: ZabbixHostGroupMappingGroup[];
}

export class ZabbixProxy {
    public host: string;
    public proxyid: string;
    public hosts: Array<ZabbixProxyHost>;
}

export class ZabbixProxyHost {
    public hostid: string;
}

export class ZabbixHostGroupMappingGroup {
    public groupid: string;
}

export class ProxyGroup {
    public hostname: string;
    public hostid: string;
    public reportingDevices: number;
}
