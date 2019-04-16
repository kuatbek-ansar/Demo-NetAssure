import * as aws from 'aws-sdk';
import { Inject, Service } from 'typedi';

import { Message } from '../models';
import { LogService } from './log.service';
import { ConfigService } from './config.service';

@Service()
export class AwsSnsService {
    private sns: aws.SNS;

    constructor(private configService: ConfigService, private logService: LogService) {
        this.sns = new aws.SNS({
            secretAccessKey: this.configService.Config.aws.secretKey,
            accessKeyId: this.configService.Config.aws.accessKeyId,
            region: this.configService.Config.aws.region
        });
    }

    public async Send(message: Message): Promise<any> {
        message.Id = this.GetGuid();

        const params = {
            TopicArn: this.configService.Config.aws.sendMailArn,
            Message: JSON.stringify(message)
        };

        this.logService.Debug('Calling SNS Publish', message);

        return new Promise((resolve, reject) => {
            this.sns.publish(params, (error, data) => {
                if (error) {
                    this.logService.Error('Calling SNS Publish', { params: params, message: message }, error);

                    return reject(error);
                } else {
                    this.logService.Debug('SNS Message Published', data);

                    return resolve(data);
                }
            });
        });
    }

    public GetGuid(): string {
        // tslint:disable-next-line:max-line-length
        return `${this.RandomBlock()}${this.RandomBlock()}-${this.RandomBlock()}-${this.RandomBlock()}-${this.RandomBlock()}-${this.RandomBlock()}${this.RandomBlock()}${this.RandomBlock()}`;
    }

    public RandomBlock(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
}
