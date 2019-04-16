import * as jsforce from 'jsforce';
import * as request from 'request-promise';
import { Service } from 'typedi';
import { LogService } from './log.service';
import { ConfigService } from './config.service';
import { Config } from '../config';

@Service()
export class SalesForceAuthenticationService {
  private config: Config;
  public connection: jsforce.Connection;

  public constructor(private log: LogService, private configService: ConfigService) {
    this.config = configService.GetConfiguration();
    this.connection = new jsforce.Connection({
      loginUrl: this.config.salesforce.loginUrl
    });
  }

  public async status(): Promise<any> {
    const options = {
      method: 'GET',
      uri: `${this.config.salesforce.healthUrl}`,
      json: true
    };

    try {
      this.log.debug('Calling Salesforce status', {options: options});
      await request(options);
      return {
        Connected: true,
        Message: 'Connection to the Salesforce API is Up'
      };
    } catch (e) {
      this.log.error('Unable to get Salesforce status', {options: options}, e);
      return {
        Connected: false,
        Message: 'Error Connecting to the SalesForce API'
      }
    }
  }

  public async authenticate(): Promise<any> {
    try {
      this.log.debug('Calling Salesforce authenticate', {apiUser: this.config.salesforce.apiUser});
      const auth = await this.connection.login(this.config.salesforce.apiUser, this.config.salesforce.apiPassword);

      return {
        Connected: true,
        Message: '',
        Id: auth.id
      }
    } catch (e) {
      this.log.error('Error calling Salesforce authenticate', {apiUser: this.config.salesforce.apiUser}, e);
      return {
        Connected: false,
        Message: 'Error Connecting to the SalesForce API'
      }
    }
  }
}
