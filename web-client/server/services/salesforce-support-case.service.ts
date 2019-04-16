import { Service } from 'typedi';
import { String } from 'typescript-string-operations';

import { SalesForceAuthenticationService } from './salesforce-authentication.service';
import { SalesForceStrings } from '../strings';
import { SupportCase, SupportCaseComment, User } from '../../models';
import { LogService } from './log.service';

@Service()
export class SalesForceSupportCaseService {
  public constructor(private authenticationService: SalesForceAuthenticationService,
    private log: LogService) {
  }

  public async getAllSupportCases(user: User): Promise<any> {
    let query = String.Format(SalesForceStrings.GetAllSupportCases, user.Account.Id);

    if (!user.SalesforceAuth.IsSuperUser) {
      query += ' ' + String.Format(SalesForceStrings.SuperUserWhereClause, user.SalesforceAuth.ContactId);
    }

    try {
      this.log.debug('Calling Salesforce GetAllSupportCases', {query: query, user: user});
      await this.authenticationService.authenticate();
      const results = await this.authenticationService.connection.query(query);

      return results.records.map(item => new SupportCase(item)) as SupportCase[];
    } catch (e) {
      this.log.error('Error calling Salesforce GetAllSupportCases', {query: query, user: user}, e);
      throw e;
    }
  }

  public async getSupportCaseDetails(caseNumber: string): Promise<any> {
    const query = String.Format(SalesForceStrings.GetSupportCaseDetails, caseNumber);

    try {
      this.log.debug('Calling Salesforce GetSupportCaseDetails', {query: query});
      await this.authenticationService.authenticate();
      const results = await this.authenticationService.connection.query(query);

      const supportCase: SupportCase = new SupportCase();
      supportCase.fillDetails(results.records[0]);

      return supportCase;
    } catch (e) {
      this.log.error('Error calling Salesforce GetSupportCaseDetails', {query: query}, e);
      throw e;
    }
  };

  public async getSupportCaseComments(caseId: string, startIndex: number = 0, rowCount: number = 10): Promise<any> {
    // TODO: refactor so that the salesforce ID of the support case doesn't need to be passed in the query string
    const query = String.Format(SalesForceStrings.GetSupportCaseComments, caseId, startIndex, rowCount);

    try {
      this.log.debug('Calling Salesforce GetSupportCaseComments', {query: query});
      await this.authenticationService.authenticate();
      const results = await this.authenticationService.connection.query(query);

      return results.records.map(item => new SupportCaseComment(item)) as SupportCaseComment[];
    } catch (e) {
      this.log.error('Error calling Salesforce GetSupportCaseComments', {query: query}, e);
      throw e;
    }
  }

  public async getSupportCasePicklistValues(fieldName: string): Promise<any> {
    try {
      this.log.debug('Calling Salesforce GetSupportCasePicklistValues', {fieldName: fieldName});
      await this.authenticationService.authenticate();
      const meta = await this.authenticationService.connection.metadata.read('CustomObject', 'Case');
      const fieldData = meta.fields
        .find(item => item.fullName === fieldName);
      const values = fieldData.valueSet.valueSetDefinition.value
        .map(item => item.label);

      return values;
    } catch (e) {
      this.log.error('Error xalling Salesforce GetSupportCasePicklistValues', {fieldName: fieldName}, e);
      throw (e);
    }
  }

  public async createSupportCase(user: User, supportCase: SupportCase): Promise<any> {
    let caseType: string;
    try {
      this.log.debug('Calling Salesforce to get case type', {supportCase: supportCase, user: user});
      await this.authenticationService.authenticate();

      /* Type__c and Severity__c are dependent picklists in Salesforce.
         The following try block attempts to find the Type that corresponds to the Severity chosen by the user */
      try {
        const meta = await this.authenticationService.connection.metadata.read('CustomObject', 'Case');
        const fieldData = meta.fields.find(item => item.fullName === 'Type__c');
        const value = fieldData.valueSet.valueSettings
          .find(item => Array.isArray(item.controllingFieldValue)
            ? item.controllingFieldValue.includes(supportCase.Severity)
            : item.controllingFieldValue === supportCase.Severity).valueName;

        caseType = Array.isArray(value) ? value[0] : value;
      } catch (e) {
        this.log.error('Error getting Salesforce case type', {supportCase: supportCase, user: user}, e);
      }

      this.log.debug('Calling Salesforce to create support case', {supportCase: supportCase, caseType: caseType, user: user});
      return await this.authenticationService.connection.sobject('Case').create({
        Type__c: caseType,
        Product__c: supportCase.Service,
        Severity__c: supportCase.Severity,
        Users_Impacted__c: supportCase.UsersImpacted,
        Site_ID__c: supportCase.Site,
        Subject: supportCase.Subject,
        Description: supportCase.Description,
        Status: 'New Incident',
        Origin: 'Web Portal',
        ContactId: user.SalesforceAuth.ContactId
      });
    } catch (e) {
      this.log.debug('Error calling Salesforce to create support case', {supportCase: supportCase, caseType: caseType, user: user});
      throw e;
    }
  }

  public async createSupportCaseComment(caseComment: SupportCaseComment): Promise<any> {
    try {
      this.log.debug('Calling Salesforce CreateSupportCaseComment', {caseComment: caseComment});
      await this.authenticationService.authenticate();

      return await this.authenticationService.connection.sobject('CaseComment').create({
        ParentId: caseComment.ParentId,
        CommentBody: caseComment.CommentBody,
        IsPublished: true
      });
    } catch (e) {
      this.log.error('Error calling Salesforce CreateSupportCaseComment', {caseComment: caseComment}, e);
      throw e;
    }
  }
}
