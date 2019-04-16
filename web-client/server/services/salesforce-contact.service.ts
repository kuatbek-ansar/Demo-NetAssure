import { Service } from 'typedi';
import { String } from 'typescript-string-operations';

import { SalesForceAuthenticationService } from './salesforce-authentication.service';
import { SalesForceStrings } from '../strings';
import { SupportCase, SupportCaseComment, User } from '../../models';
import { LogService } from './log.service';

@Service()
export class SalesforceContactService {
  public constructor(private authenticationService: SalesForceAuthenticationService,
    private log: LogService) {
  }
  public async getPostalCodes(): Promise<any> {
    const query = SalesForceStrings.GetGroupBillingPostalCodes;

    try {
      this.log.debug('Calling Salesforce GetGroupBillingPostalCodes', {query: query});
      await this.authenticationService.authenticate();
      const results = await this.authenticationService.connection.query(query);


      return results;
    } catch (e) {
      this.log.error('Error calling Salesforce GetGroupBillingPostalCodes', {query: query}, e);
      throw e;
    }
  };
  public async getGroupPostalCode(groupId: string): Promise<any> {
    const query = String.Format(SalesForceStrings.GetGroupBillingPostalCode, groupId);

    try {
      this.log.debug('Calling Salesforce GetGroupBillingPostalCode', {query: query});
      await this.authenticationService.authenticate();
      const results = await this.authenticationService.connection.query(query);


      return results;
    } catch (e) {
      this.log.error('Error calling Salesforce GetGroupBillingPostalCode', {query: query}, e);
      throw e;
    }
  };
}
