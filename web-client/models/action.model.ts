export class Action {
  /**
   * (readonly) ID of the action.
   * Zabbix - [[Action.actionid]]
   */
  public readonly actionId: string;

  /**
   * Default operation step duration. Must be greater than 60 seconds. Accepts seconds, time unit with suffix and user macro.
   * Zabbix - [[Action.esc_period]]
   */
  public stepDuration: string;

  /**
   * (constant) Type of events that the action will handle.
   * Refer to the event "source" property for a list of supported event types.
   * Zabbix - [[Action.eventsource]]
   */
  public eventSource: number;

  /**
   * Name of the action
   * Zabbix - [[Action.Name]]
   */
  public name: string;

  /**
   * problem message text
   * Zabbix - [[Action.def_longdata]]
   */
  public problemMessageText: string;

  /**
   * problem message Subject
   * Zabbix - [[Action.def_shortdata]]
   */
  public problemMessageSubject: string;

  /**
   * Recovery message text
   * Zabbix - [[Action.r_longdata]]
   */
  public recoveryMessageText: string;

  /**
   * Recovery message Subject
   * Zabbix - [[Action.r_shortdata]]
   */
  public recoveryMessageSubject: string;

  /**
   * Default acknowledge operation message text.
   * Zabbix - [[Action.ack_longdata]]
   */
  public acknowledgementMessageText: string;

  /**
   * Default acknowledge operation message Subject.
   * Zabbix - [[Action.ack_shortdata]]
   */
  public acknowledgementMessageSubject: string;

  /**
   * Whether the action is enabled or disabled.
   * Zabbix - [[Action.Status]]
   */
  public isEnabled = true;

  /**
   * Whether to pause escalation during maintenance periods or not.
   * Zabbix - [[Action.maintenance_mode]]
   */
  public shouldPauseForMaintenance = true;

  constructor(init: any = {}) { // {{{
    this.actionId = init.actionId || init.actionid;
    this.stepDuration = init.stepDuration || init.esc_period;
    this.eventSource = init.eventSource || init.eventSource;
    this.name = init.name;
    this.acknowledgementMessageSubject = init.acknowledgementMessageSubject || init.ack_shortdata;
    this.acknowledgementMessageText = init.acknowledgementMessageText || init.ack_longdata;
    this.problemMessageSubject = init.problemMessageSubject || init.def_shortdata;
    this.problemMessageText = init.problemMessageText || init.def_longdata;
    this.recoveryMessageSubject = init.recoveryMessageSubject || init.r_shortdata;
    this.recoveryMessageText = init.recoveryMessageText || init.r_longdata;
    this.shouldPauseForMaintenance = init.shouldPauseForMaintenance || init.maintenance_mode === 0;
    this.isEnabled = init.isEnabled || init.status === 0;
  }
}
