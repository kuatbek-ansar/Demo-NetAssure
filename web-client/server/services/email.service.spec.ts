process.env.NODE_ENV = 'test';
import { expect } from 'chai'
import { EmailService, EmailMessage } from './email.service';
import { MessagingService, Message } from './messaging.service';
import { LogService } from './log.service';
import { ConfigService } from './config.service';
import { mock, instance, anything, when, verify } from 'ts-mockito';
import { Config } from '../config/config';

let messagingSendCalled = false;
let messageToBeSent: Message;
let validMessage: EmailMessage;

class FakeMessageService extends MessagingService {
  send(message: Message): Promise<void> {
    messagingSendCalled = true;
    messageToBeSent = message;
    return;
  }
}

class FakeLogger extends LogService {
  constructor(configService: ConfigService) {
    super(configService);
  }
  info(message: string, parameters: any, exception: any = null): void {
    console.log('Logged Info >>>');
    console.log('Message:', message);
    console.log('Properties:', parameters);
    console.log('Error:', exception);
    console.log('<<< End Logged Info');
  }

  error(message: string, parameters: any, exception: any = null): void {
    console.log('Logged Error >>>');
    console.log('Message:', message);
    console.log('Properties:', parameters);
    console.log('Error:', exception);
    console.log('<<< End Logged Error');
  }
}

describe('Email Service: Unit', () => {
  let service: EmailService;

  beforeEach(function () {
    const mockConfigService = mock(ConfigService);
    console.dir(Config);
    const config = { salesforce: {}, aws: {} };
    when(mockConfigService.GetConfiguration()).thenReturn(<any>config);
    service = new EmailService(
      new FakeMessageService(new FakeLogger(instance(mockConfigService)),
        instance(mockConfigService)),
      new FakeLogger(instance(mockConfigService)));
  });
  beforeEach(function () {
    validMessage = new EmailMessage();

    validMessage.subject = 'Testing the email service';
    validMessage.toAddress = 'testy@mctester.com';
    validMessage.template = 'This is a test email';
  });
  afterEach(function () {
    messagingSendCalled = false;
  });

  it('Should send via messaging', function () {
    service.send(validMessage);
    // tslint:disable-next-line:no-unused-expression
    expect(messagingSendCalled).to.be.true;
  });

  it('Message should be email', function () {
    service.send(validMessage);
    expect(messageToBeSent.medium).to.equal('email');
  });

  it('Should throw without message.toAddress defined', function () {
    const badMessage = validMessage;
    badMessage.toAddress = '';
    expect(() => service.send(badMessage)).to.throw();
  });

  it('Should throw without message.subject defined', function () {
    const badMessage = validMessage;
    badMessage.subject = '';
    expect(() => service.send(badMessage)).to.throw();
  });

  it('Should throw without message.template defined', function () {
    const badMessage = validMessage;
    badMessage.template = '';
    expect(() => service.send(badMessage)).to.throw();
  });
});
