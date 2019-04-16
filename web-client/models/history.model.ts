export type Calculation =
  'minimum' |
  'average' |
  'maximum' |
  'all values' |
  'last value'

export type DatumStyle =
  'line' |
  'filled region' |
  'bold line' |
  'dot' |
  'dashed line' |
  'gradient line'

export type DatumType =
  'simple' |
  'sum'

export type Side =
  'left' |
  'right'

export class History {
  /*
   * The Date the Datum was collected
   * Zabbix - [[History.clock]]
   */
  public date: Date;
  /*
   * The raw value of the Datum
   * Zabbix - [[History.value]]
   */
  public value: number;
  /*
   * The itemId of the parent metric
   * Zabbix - [[Item.itemid]]
   */
  public itemId: string;
  /*
   * Nanoseconds when the value what retrieved
   * Zabbix - [[History.clock]]
   */
  public nanoseconds: any;

  constructor(init: any = {}) {
    this.itemId = init.itemId || init.itemid;
    this.value = 1 * init.value;

    if (init.clock) {
      this.date = new Date(parseInt(`${init.clock}000`, 0))
    } else {
      this.date = new Date(init.date);
    }

    const nanoseconds = init.nanoseconds || init.ns;
    this.nanoseconds = parseInt(nanoseconds, 0)
  }
}
