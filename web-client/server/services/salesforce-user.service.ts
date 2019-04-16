import * as jwt from 'jsonwebtoken';
import * as request from 'request-promise';
import * as xml2js from 'xml2js';
import { Service, Container } from 'typedi';
import { String } from 'typescript-string-operations';
import { Account, User } from '../../models';
import { SalesForceAuthenticationService } from './salesforce-authentication.service';
import { EmailService } from './email.service';
import { SalesForceStrings, EmailTemplate } from '../strings';
import { LogService } from './log.service';
import { Config } from '../config';
import { ConfigService } from './config.service';

@Service()
export class SalesForceUserService {
  private config: Config;
  public constructor(
    private authenticationService: SalesForceAuthenticationService,
    private emailService: EmailService,
    private log: LogService,
    private configService: ConfigService) {
    this.config = configService.GetConfiguration();
  }

  public async authenticate(username: string, password: string): Promise<any> {
    if (!username || !password) {
      throw new Error(SalesForceStrings.MissingCredentials);
    } else {
      try {
        this.log.debug('Calling Salesforce User Authenticate', { username: username });
        await this.authenticationService.authenticate();

        const authenticateSoap = String.Format(
          SalesForceStrings.AuthenticateSoap,
          this.config.salesforce.organizationId,
          username, password);
        const uri = String.Format(this.config.salesforce.selfServiceUrl, this.authenticationService.connection.instanceUrl);
        const options = {
          method: 'POST',
          uri: uri,
          body: authenticateSoap,
          headers: {
            'Content-Type': 'text/xml',
            'SOAPAction': '""'
          }
        };

        const authResponse = await request(options);
        const authObject = this.parseAuthResponseXml(authResponse);
        const pwdExpired = authObject.passwordExpired;
        const expiredPassword = (pwdExpired === 'true');

        return await this.getSelfServiceUser(username, expiredPassword);
      } catch (e) {
        this.log.error('Error calling Salesforce GetSelfServiceUser', { username: username }, e);
        throw new Error(SalesForceStrings.InvalidCredentials);
      }
    }
  }

  public async getAndSendTempPassword(username: string): Promise<any> {
    try {
      this.log.debug('Calling Salesforce GetTempPassword', { username: username });
      const authentication = await this.authenticationService.authenticate();
      const userInfo = await this.getSelfServiceUser(username);
      const userId = userInfo.User.SalesforceAuth.UserId;
      const email = userInfo.User.EmailAddress;
      const tempPwdResult = await this.getTempPassword(userId);

      this.emailService.send({
        toAddress: email,
        subject: 'Network Assure Temp Password',
        template: EmailTemplate.PasswordReset,
        variables: [tempPwdResult.password]
      });
      return
    } catch (e) {
      this.log.error('Unable to get and send temp password', { username: username }, e);
    }
  }

  public async setNewPassword(username: string, newPassword: string): Promise<any> {
    try {
      this.log.debug('Calling Salesforce SetNewPassword', { username: username });
      const authentication = await this.authenticationService.authenticate();
      const userInfo = await this.getSelfServiceUser(username);
      const userId = userInfo.User.SalesforceAuth.UserId;
      const responseText = await this.authenticationService.connection.soap.setPassword(userId, newPassword);
      return;
    } catch (e) {
      this.log.error('Unable to set new password with Salesforce', { username: username }, e);
    }
  }

  private async getSelfServiceUser(username: string, pwdExpired: boolean = false): Promise<any> {
    const query = String.Format(SalesForceStrings.GetSelfServiceUser, username);

    try {
      this.log.debug('Calling Salesforce GetSelfServiceUser', { username: username, query: query });
      const result = await this.authenticationService.connection.query(query);
      const selfServiceUser = result.records[0];
      const contactId = selfServiceUser.ContactId;
      const contactQuery = String.Format(SalesForceStrings.GetAccount, contactId);
      const contactResult = await this.authenticationService.connection.query(contactQuery);
      const contact = contactResult.records[0];
      const user: User = new User({
        Account: {
          Name: contact.Account.Name,
          Id: contact.Account.Id,
          GroupName: contact.Account.Monitor_Abbrev__c,
          GroupId: contact.Account.Monitor_Abbrev_Id__c
        },
        HostGroup: {
          Id: contact.Account.Monitor_Abbrev_Id__c,
          Name: contact.Account.Monitor_Abbrev__c
        },
        SalesforceAuth: {
          InstanceUrl: this.authenticationService.connection.instanceUrl,
          AccessToken: this.authenticationService.connection.accessToken,
          UserId: selfServiceUser.Id,
          ContactId: contactId,
          IsSuperUser: selfServiceUser.SuperUser,
          UserGroups: contact.Contact_Function__c ? contact.Contact_Function__c.split(';') : []
        },
        IsAuthenticated: !pwdExpired,
        Username: username,
        EmailAddress: selfServiceUser.Email,
        PasswordExpired: pwdExpired
      });

      if (!user.HostGroup || !user.HostGroup.Id) {
        throw new Error(SalesForceStrings.MissingGroupId);
      }

      const token = jwt.sign(user, this.config.jwtSecret, {
        expiresIn: '24h'
      });

      user.Accounts = await this.getAccounts(user.Account.Id);
      user.Accounts.push(user.Account);
      user.Accounts.sort((x: Account) => parseInt(x.GroupId, 0));

      return {
        User: user,
        Token: token
      };
    } catch (e) {
      this.log.error('Error calling Salesforce GetSelfServiceUser', { username: username, query: query }, e);
      throw e;
    }
  }

  public async getAccounts(parentId: string, subAccounts?: Account[]): Promise<any> {
    try {
      this.log.debug('Calling Salesforce GetAccounts', { parentId: parentId, subAccounts: subAccounts });
      const children = subAccounts || [];
      const query = String.Format(SalesForceStrings.GetAccountsByParentId, parentId);
      const result = await this.authenticationService.connection.query(query);
      const records = result.records;

      records.forEach((item) => {
        children.push({
          Id: item.Id,
          Name: item.Name,
          GroupId: item.Monitor_Abbrev_Id__c,
          GroupName: item.Monitor_Abbrev__c
        });
      });

      for (let i = 0; i < records.length; i++) {
        await this.getAccounts(records[i].Id, children);
      }

      return children;
    } catch (e) {
      this.log.error('Error calling Salesforce GetAccounts', { parentId: parentId, subAccounts: subAccounts }, e);
      throw e;
    }
  }

  public async getTempPassword(userId: string): Promise<{ password: string }> {
    try {
      this.log.debug('Calling Salesforce ResetPassword', { userId: userId });
      return this.authenticationService.connection.soap.resetPassword(userId);
    } catch (e) {
      this.log.error('Error calling Salesforce ResetPassword', { userId: userId }, e);
      throw new Error(SalesForceStrings.NoTempPassword);
    }
  }

  private parseAuthResponseXml(xmlString: string): any {
    let parsed;
    xml2js.parseString(xmlString, (err, result) => { parsed = result });

    // weird chained property list due to SOAP response type
    const responseResult = parsed['soapenv:Envelope']['soapenv:Body'][0]['loginResponse'][0]['result'][0];

    for (const prop in responseResult) {
      if (responseResult.hasOwnProperty(prop)) {
        responseResult[prop] = responseResult[prop][0];
      }
    }

    return responseResult;
  }

}
