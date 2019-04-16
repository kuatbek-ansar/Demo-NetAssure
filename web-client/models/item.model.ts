import { History } from './history.model';

export type ValueType =
  'numeric float' |
  'character' |
  'log' |
  'numberic unsigned' |
  'text'

export type MetricType =
  'Zabbix agent' |
  'SNMPv1 agent' |
  'Zabbix trapper' |
  'simple check' |
  'SNMPv2 agent' |
  'Zabbix internal' |
  'Zabbix internal' |
  'Zabbix internal' |
  'SNMPv3 agent' |
  'Zabbix agent (active)' |
  'Zabbix aggregate' |
  'web item' |
  'external check' |
  'database monitor' |
  'IPMI agent' |
  'SSH agent' |
  'TELNET agent' |
  'calculated' |
  'JMX agent' |
  'SNMP agent' |
  'Dependent item'

/**
 * A vector of data collected by network monitoring
 * Belongs to a Device or Interface
 *
 * https://www.zabbix.com/documentation/3.4/manual/api/reference/item
 */
export class Item {
  /**
   * Item key
   * Zabbix - [[Item.key_]]
   */
  public key: string;

  /**
   * Name of the Metric
   * Zabbix - [[Item.Name]]
   */
  public name: string;

  /**
   * Type of Metric / Metric collection source
   * Zabbix - [[Item.type]]
   */
  public metricType: MetricType;

  /**
   * Type of value the metric provides
   * Zabbix - [[Item.value_type]]
   */
  public valueType: ValueType;

  /**
   * Description of the metric
   * Zabbix - [[Item.description]]
   */
  public description: string;

  /**
   * Error text if there are problems updating the item
   * Zabbix - [[Item.error]]
   */
  public error: string;

  /**
   * A time unit of how long the history should be stored. Also accepts user macro
   * Zabbix - [[Item.history]]
   */
  public history: string;

  /**
   * Last value of the metric
   * Zabbix - [[Item.lastvalue]]
   */
  public lastValue: any;

  /**
   * Whether or not the metric is supported by Zabbix
   * Zabbix - [[Item.State]]
   */
  public isSupported: boolean;

  /**
   * Units the Metric value is measured in
   * Zabbix - [[Item.units]]
   */
  public units: string;

  /**
   * Zabbix - [[Item.itemid]]
   */
  public itemid: string;

  /**
   * Updatnterval of the item. Accepts seconds or time
   * unit with suffix and with or without one or more custom
   * intervals that consist of either flexible intervals and
   * scheduling intervals as serialized strings. Also accepts
   * user macros. Flexible intervals could be written as two
   * macros separated by a forward slash. Intervals are
   * separated by a semicolon.
   * Optional for Zabbix trapper or Dependent iteme interval
   * of the item. Accepts seconds or time unit with suffix
   * and with or without one or more custom intervals that
   * consist of either flexible intervals and scheduling
   * intervals as serialized strings. Also accepts user macros.
   * Flexible intervals could be written as two macros separated
   * by a forward slash. Intervals are separated by a semicolon.
   * Zabbix - [[Item.delay]]
   */
  public delay: string;

  /**
   * [[Device.zabbixHostId]]
   * Zabbix - [[Host.hostid]]
   */
  public hostId: string;

  /**
   * [[Interface.interfaceId]]
   * Zabbix - [[Interface.interfaceid]]
   */
  public interfaceId: string;

  public type: string;
  public value_type: string;

  /**
   * Metric data obtained through the Zabbix [[History]] API
   */
  public historys: History[];

  constructor(init: any = {}) {
    init.interfaceId = init.interfaceId || init.interfaceid;
    init.hostId = init.hostId || init.hostid;
    init.delay = init.delay || init.Delay;
    init.itemId = init.itemId || init.itemid;
    init.units = init.units || init.Units;
    init.lastValue = init.lastValue || init.lastvalue;
    init.history = init.history || init.History;
    init.error = init.error || init.Error;
    init.description = init.description || init.Description;
    init.valueType = init.valueType || init.value_type;
    init.metricType = init.metricType || init.type;
    init.name = init.name || init.Name;
    init.key = init.key || init.key_;

    Object.assign(this, [
      init.interfaceId,
      init.hostId,
      init.delay,
      init.itemId,
      init.units,
      init.lastValue,
      init.lastTick,
      init.lastUpdated,
      init.history,
      init.error,
      init.description,
      init.valueType,
      init.metricType,
      init.name,
      init.key
    ]);

    this.historys = init.historys || init.data;
  }

  public get metricId(): string {
    return this.itemid;
  }

  public get data(): History[] {
    return this.historys;
  }

  public set data(data: History[]) {
    this.historys = data;
  }
}

export class Metric extends Item {
  constructor(init: any = {}) {
    super(init)
  }
}
