export type AlertType =
  'message' |
  'remote command';

export class Alert {
  /**
   * Zabbix - [[Alert.alertid]]
   */
  public alertId: string;

  /**
   * Zabbix - [[Alert.alerttype]]
   */
  public type: AlertType;

  /**
   * alert timestamp
   * Zabbix - [[Alert.clock]]
   */
  public date: Date;

  /**
   * Error text if there are problems sending a message or running a command
   * Zabbix - [[Alert.error]]
   */
  public error: string;

  /**
   * Message text used for alerts
   * Zabbix - [[Alert.message]]
   */
  public message: string;

  /**
   * Number of times zabbix tried to resend the message
   * Zabbix - [[Alert.retries]]
   */
  public retries: number;

  /**
   * Address, user Name or other identifier of the recipient. Used for message alerts.
   * Zabbix - [[Alert.sendto]]
   */
  public sendTo: number;

  /**
   * Message Subject. Used for message alerts.
   * Zabbix - [[Alert.Subject]]
   */
  public subject: number;

  constructor(init: any = {}) { // {{{
    init.alertId = init.alertId || init.alertid
    init.date = init.date || init.clock
    init.error = init.error;
    init.message = init.message;
    init.retries = init.retries;
    init.sendTo = init.sendTo || init.sendto;
    init.subject = init.subject;

    Object.assign(this, init, [
      init.alertId,
      init.date,
      init.error,
      init.message,
      init.retries,
      init.sendTo,
      init.subject
    ]);

    this.date = new Date(this.date);
  }
}
