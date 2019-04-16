export type TriggerOrigin = 'plain trigger' | 'discovered trigger';

export type TriggerSeverity =
  'not classified' |
  'information' |
  'warning' |
  'average' |
  'high' |
  'disaster';

export type NotificationState = 'up to Date' | 'unknown';

export type NotificationRecoveryMode = 'expression' | 'recovery expression' | 'none'

export type NotificationCorrelationMode = 'all problems' | 'problems matching tag'

export class Notification {
  public triggerId: string;

  public name: string;

  public expression: string;

  public recoveryExpression: string;

  public comments: string;

  public readonly error: string;

  public readonly origin: TriggerOrigin;

  public lastChange: Date;

  public severity: TriggerSeverity;

  public readonly state: NotificationState;

  public isEnabled: boolean;

  public readonly templateId: boolean;

  public canGenerateMultipleProblems: boolean;

  public url: boolean;

  public readonly hasProblem: boolean;

  public recoveryMode: NotificationRecoveryMode;

  public correlationMode: NotificationCorrelationMode;

  public correlationTag: string;

  public allowManualClose: boolean;

  public hostName: string;

  constructor(init: any = {}) {
    this.triggerId = init.triggerId || init.triggerid;
    this.name = init.name || init.description;
    this.expression = init.expression;
    this.comments = init.comments;
    this.error = init.error;

    if (init.origin === 'plain trigger') {
      this.origin = 'plain trigger'
    } else if (init.flags === 0) {
      this.origin = 'plain trigger';
    } else if (init.origin === 'discovered trigger') {
      this.origin = 'discovered trigger';
    } else if (init.flags === 4) {
      this.origin = 'discovered trigger';
    }

    this.lastChange = new Date(parseInt(`${init.lastchange}000`, 0));

    if (init.severity) {
      switch (init.severity) {
        case 'not classified':
          this.severity = 'not classified';
          break;
        case 'information':
          this.severity = 'information';
          break;
        case 'warning':
          this.severity = 'warning';
          break;
        case 'average':
          this.severity = 'average';
          break;
        case 'high':
          this.severity = 'high';
          break;
        case 'disaster':
          this.severity = 'disaster';
          break;
      }
    } else if (typeof init.priority === 'string') {
      switch (init.priority) {
        case '0':
          this.severity = 'not classified';
          break;
        case '1':
          this.severity = 'information';
          break;
        case '2':
          this.severity = 'warning';
          break;
        case '3':
          this.severity = 'average';
          break;
        case '4':
          this.severity = 'high';
          break;
        case '5':
          this.severity = 'disaster';
          break;
      }
    }

    if (init.state === 'up to Date') {
      this.state = 'up to Date';
    } else if (init.state === 0) {
      this.state = 'up to Date';
    } else if (init.state === 'unknown') {
      this.state = 'unknown';
    } else if (init.state === 1) {
      this.state = 'unknown';
    }

    this.isEnabled = init.isEnabled || (init.status === 0);
    this.templateId = init.templateId || init.templateid;

    if (init.canGenerateMultipleProblems) {
      this.canGenerateMultipleProblems = true;
    } else if (init.canGenerateMultipleProblems === false) {
      this.canGenerateMultipleProblems = false;
    } else if (init.type === 1) {
      this.canGenerateMultipleProblems = true;
    } else if (init.type === 0) {
      this.canGenerateMultipleProblems = false;
    }

    this.url = init.url;
    this.hasProblem = init.hasProblem || (init.value === 1) || (init.value === '1');

    if (init.recoveryMode === 'expression') {
      this.recoveryMode = 'expression';
    } else if (init.recoveryMode === 'recovery expression') {
      this.recoveryMode = 'recovery expression';
    } else if (init.recoveryMode === 'none') {
      this.recoveryMode = 'none';
    } else if (init.recovery_mode === 0) {
      this.recoveryMode = 'expression';
    } else if (init.recovery_mode === 1) {
      this.recoveryMode = 'recovery expression';
    } else if (init.recovery_mode === 2) {
      this.recoveryMode = 'none';
    }

    this.recoveryExpression = init.recoveryExpression || init.recovery_expression;

    if (init.correlationMode === 'all problems') {
      this.correlationMode = 'all problems';
    } else if (init.correlationMode === 'problems matching tag') {
      this.correlationMode = 'problems matching tag';
    }

    this.correlationTag = init.correlationTag || init.correlation_tag;
    this.allowManualClose = init.allowManualClose || (init.manual_close === 1);

    this.hostName = init.hosts[0].name || init.hosts[0].host || 'unknown';
  }
}
