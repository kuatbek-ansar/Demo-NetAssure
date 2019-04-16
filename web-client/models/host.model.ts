import { Address } from './address.model';
import { Geolocation } from './geolocation.model';
import { Graph } from './graph.model';
import { HostInterface } from './host-interface.model';
import { Iface } from './iface.model';
import { Metric } from './item.model';
import { Notification } from './notification.model';
import { DeviceInterface } from './device-interface.model';
import { Circuit } from './circuit.model';
import { ManagedDevice } from './managed-device.model';

export type ZabbixStatus =
  'monitored' |
  'unmonitored' |
  'unknown';


export class HostItem {
  itemid: string;
  name: string;

  monitoringData: any;

  InterfaceMetadata: DeviceInterface;
  Circuit: Circuit;
  IsCircuit: boolean;
}

/**
 * A network host device
 *
 * https://www.zabbix.com/documentation/3.4/manual/api/reference/host
 */
export class Host {
  /**
   * Zabbix - [[Host.hostid]]
   */
  public zabbixHostId: string;

  /**
   * Zabbix - [[ Host.groups[].groupid ]]
   */
  public groupIds: string[];

  /**
   * Technical Name - set by the NOC or the device itself
   * Zabbix - [[Host.host]]
   */
  public internalName: string;

  /**
   * Visible Name - set by the application user
   * Zabbix - [[Host.name]]
   */
  public displayName: string;

  /**
   * Zabbix Monitoring Status
   * Zabbix - [[Host.status]]
   */
  public zabbixStatus: string;

  /**
   * Operating System
   * Zabbix - [[HostInventory.os]]
   */
  public deviceType: string;

    /**
   * Operating System
   * Zabbix - [[HostInventory.os]]
   */
  public operatingSystem: string;

  /**
   * Primary Serial Number of the device
   * Zabbix - [[HostInventory.serialno_a]]
   */
  public serialNumberA: string;

  /**
   * Secondary Serial Number of the device
   * Zabbix - [[HostInventory.serialno_b]]
   */
  public serialNumberB: string;

  /**
   * Physical hardware the device is running
   * Zabbix - [[HostInventory.hardware]]
   */
  public hardware: string;

  /**
   * Point of contact for the device
   * Zabbix - [[HostInventory.contact]]
   */
  public contact: string;

  /**
   * Model number or Model Name of the device
   * Zabbix - [[HostInventory.model]]
   */
  public model: string;

  /**
   * Physical Address of the device - line 1
   * Zabbix - [[HostInventory.site_address_a]]
   */
  public siteAddressA: Address;

  /**
   * Physical Address of the device - line 2
   * Zabbix - [[HostInventory.site_address_b]]
   */
  public siteAddressB: Address;

  /**
   * Physical Address of the device - line 3
   * Zabbix - [[HostInventory.site_address_c]]
   */
  public siteAddressC: Address;

  /**
   * Location description reported by the device
   * Zabbix - [[HostInventory.location]]
   */
  public locationDescription: string;

  /**
   * Zabbix - [[HostInventory.location_lat]] & [[HostInventory.location_lon]]
   */
  public geolocation: Geolocation;

  /**
   * Zabbix - [[HostInventory.notes]]
   */
  public notes: string;

  /**
   * Zabbix - [[Item]]
   */
  public graphs: Graph[];

  /**
   * Zabbix - [[Item]]
   */
  public metrics: Metric[];

  /**
   * Zabbix - [[Interface.ip]]
   */
  public ipAddress: string;

  public service: string;

  public triggers: Notification[];

  public hostInterfaces: HostInterface[] = [];

  public hostItems: HostItem[];

  public ifaces: Iface[];

  /**
   * Whether to enable Network Assure billing for the Device
   */
  public isBillable: boolean;

  public managedDevice: ManagedDevice;

  constructor(init: any = {}) {
    if (init.zabbixStatus === 'unmonitored' || init.zabbixStatus === 1 || init.zabbixStatus === '1') {
      this.zabbixStatus = 'unmonitored';
    } else if (init.zabbixStatus === 'monitored' || init.zabbixStatus === 0 || init.zabbixStatus === '0') {
      this.zabbixStatus = 'monitored';
    } else {
      this.zabbixStatus = 'unknown';
    }

    this.contact = init.contact || (init.inventory ? init.inventory.contact : '');
    this.displayName = init.displayName || init.name;
    this.geolocation = init.geolocation || new Geolocation({
      latitude: (init.inventory ? init.inventory.location_lat : ''),
      longitude: (init.inventory ? init.inventory.location_lon : '')
    });
    this.groupIds = init.groupIds || (init.groups ? init.groups.map((group: any) => group.groupid) : []);
    this.hardware = init.hardware || (init.inventory ? init.inventory.hardware : '');
    this.internalName = init.internalName || init.host;
    this.ipAddress = init.ipAddress || (init.interfaces ? init.interfaces[0].ip : '');
    // this.metrics = init.metrics || (init.items ? init.items.map(item => new Metric(item)) : []);
    this.hostItems = init.items;
    this.model = init.model || (init.inventory ? init.inventory.model : '');
    this.notes = init.notes || (init.inventory ? init.inventory.notes : '');
    this.deviceType = init.deviceType || (init.inventory ? init.inventory.type : '');
    this.operatingSystem = init.operatingSystem || (init.inventory ? init.inventory.os : '');
    this.serialNumberA = init.serialNumberA || (init.inventory ? init.inventory.serialno_a : '');
    this.serialNumberB = init.serialNumberB || (init.inventory ? init.inventory.serialno_b : '');
    this.siteAddressA = init.siteAddressA || (init.inventory ? init.inventory.site_address_a : '');
    this.siteAddressB = init.siteAddressB || (init.inventory ? init.inventory.site_address_b : '');
    this.siteAddressC = init.siteAddressC || (init.inventory ? init.inventory.site_address_c : '');
    this.locationDescription = init.locationDescription || (init.inventory ? init.inventory.location : '');
    this.zabbixHostId = init.zabbixHostId || init.hostid;
    this.zabbixStatus = init.zabbixStatus || init.status;
    this.triggers = init.triggers;
    this.graphs = init.graphs;
    this.hostInterfaces = init.hostInterfaces;
    this.ifaces = init.ifaces || [];
  }

  public get zabbixUpdateDto(): any {
    return {
      hostid: this.zabbixHostId,
      name: this.displayName,
      inventory: {
        contact: this.contact,
        location_lat: this.geolocation.latitude,
        location_lon: this.geolocation.longitude,
        notes: this.notes,
        site_address_a: this.siteAddressA,
        site_address_b: this.siteAddressB,
        site_address_c: this.siteAddressC
      }
    }
  }

  public get deviceId(): string {
    return this.zabbixHostId;
  }

  public get problemTriggers(): Notification[] {
    return this.triggers.filter((item) => item.hasProblem);
  }

  public get passingTriggers(): Notification[] {
    return this.triggers.filter(item => !item.hasProblem);
  }

  public get items() {
    return this.metrics;
  }

  public set items(items) {
    this.metrics = items;
  }

  public get hostId() {
    return this.zabbixHostId;
  }

  public set hostId(id) {
    this.zabbixHostId = id;
  }
}
