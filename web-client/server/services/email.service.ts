import { Service } from 'typedi';
import { String } from 'typescript-string-operations';
import { MessagingService } from './messaging.service';
import { LogService } from './log.service';

@Service()
export class EmailService {
  constructor(private messagingService: MessagingService, private log: LogService) {
  }

  public send(message: EmailMessage): Promise<void> {
    if (!message.toAddress) {
      throw new Error('TO Address is not defined. Unable to send email');
    }

    if (!message.subject) {
      throw new Error('Subject is not defined. Unable to send email');
    }

    if (!message.template) {
      throw new Error('Template is not defined. Unable to send email');
    }

    const body = String.Format(message.template, ...message.variables);

    this.log.debug(`Sending email TO: ${message.toAddress}`,
      { messageTo: message.toAddress, messageSubject: message.subject, messageBody: body });
    try {
      this.messagingService.send({
        id: this.getGuid(),
        medium: 'email',
        subject: message.subject,
        destination: message.toAddress,
        body: body
      });
    } catch (e) {
      this.log.error('Unable to send email message', { messageTo: message.toAddress, messageSubject: message.subject, messageBody: body });
    }

    return;
  }

  private getGuid() {
    // tslint:disable-next-line:max-line-length
    return `${this.randomBlock()}${this.randomBlock()}-${this.randomBlock()}-${this.randomBlock()}-${this.randomBlock()}-${this.randomBlock()}${this.randomBlock()}${this.randomBlock()}`;
  }

  private randomBlock() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}

export class EmailMessage {
  public toAddress: string;
  public subject: string;
  public template: string
  public variables: string[];
}
