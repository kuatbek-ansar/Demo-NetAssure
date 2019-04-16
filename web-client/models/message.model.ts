export type Severity = 'error' | 'info' | 'warn' | 'success' | 'hidden';

export class Message {
  public Severity: Severity;

  public Summary: string;

  public Detail: string;

  public Date: Date = new Date(Date.now());

  constructor(init: any = {}) {
    Object.assign(this, [
      init.severity,
      init.summary,
      init.detail
    ]);
  }
}

export class ErrorMessage extends Message {
  public Severity: Severity = 'error';

  constructor(init: any = {}) {
    super({summary: init.summary, detail: init.detail});
  }
}

export class InfoMessage extends Message {
  public Severity: Severity = 'info';

  constructor(init: any = {}) {
    super({summary: init.summary, detail: init.detail});
  }
}

export class WarningMessage extends Message {
  public Severity: Severity = 'warn';

  constructor(init: any = {}) {
    super({summary: init.summary, detail: init.detail});
  }
}

export class SuccessMessage extends Message {
  public Severity: Severity = 'success';

  constructor(init: any = {}) {
    super({summary: init.summary, detail: init.detail});
  }
}

export class HiddenMessage extends Message {
  public Severity: Severity = 'hidden';

  constructor(init: any = {}) {
    super({summary: init.summary, detail: init.detail});
  }
}
