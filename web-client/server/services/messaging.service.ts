import * as aws from 'aws-sdk';
import { Service } from 'typedi';
import * as appInsights from 'applicationinsights';
import { LogService } from './log.service';
import { ConfigService } from './config.service';
import { Config } from '../config';

@Service()
export class MessagingService {
  private config: Config;
  private sns: aws.SNS;

  constructor(private log: LogService, private configService: ConfigService) {
    this.config = configService.GetConfiguration();
    this.sns = new aws.SNS({
      secretAccessKey: this.config.aws.secretKey,
      accessKeyId: this.config.aws.accessKeyId,
      region: this.config.aws.region
    });
  }

  public async send(message: Message): Promise<any> {
    const params = {
      TopicArn: this.config.aws.sendMailArn,
      Message: JSON.stringify(message),
    };

    this.log.debug('Calling SNS publish', {params: params, message: message});
    this.sns.publish(params, (err, data) => {
      if (err) {
        this.log.error('Error while calling SNS publish', {params: params, message: message}, err);
        appInsights.defaultClient.trackException({
          exception: err,
          properties: {'message': JSON.stringify(message)}
        });
      } else {
        appInsights.defaultClient.trackEvent({
          name: 'Message sent to SNS',
          properties: {'message': JSON.stringify(message)}
        });
      }
    });
  }
}

export class Message {
  public id: string; // guid
  public destination: string;
  public subject: string;
  public body: string;
  public medium: string; // email, sms, ...
}
