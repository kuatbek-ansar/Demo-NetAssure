import 'reflect-metadata';
import { Container } from 'typedi/Container';

import { SalesForceUserService } from './salesforce-user.service';
import { Account, SalesforceAuth } from '../../models';
import { expect } from 'chai';
import { SalesForceStrings } from '../strings/index';
import { SalesForceAuthenticationService } from './salesforce-authentication.service';
import { mock, instance } from 'ts-mockito/lib/ts-mockito';
import { EmailService } from './email.service';
import { LogService } from './log.service';
import { ConfigService } from './config.service';

describe('SalesForce User Service: Unit', () => {
  const username = 'test1@affiniti.com.ana';
  const password = 'Network@ssure';
  let service: SalesForceUserService;

  beforeEach(function () {
    const mockAuthService = mock(SalesForceAuthenticationService);
    const mockEmailService = mock(EmailService);
    const mockLogService = mock(LogService);
    const mockConfigService = mock(ConfigService);
    service = new SalesForceUserService(instance(mockAuthService),
      instance(mockEmailService),
      instance(mockLogService),
      instance(mockConfigService));
  });
  it('Should Throw On Authenticate With Missing Username: Unit', async function () {
    this.timeout(40000);

    try {
      await service.authenticate(undefined, password);
      expect.fail(false, true, 'Should have thrown an exception for missing username');
    } catch (e) {
      // tslint:disable-next-line:no-unused-expression
      expect(e).to.exist;
    }
  });

  it('Should Throw On Authenticate With Missing Password: Unit', async function () {
    this.timeout(40000);
    try {
      await service.authenticate(username, undefined);
      expect.fail(false, true, 'Should have thrown an exception for missing password');
    } catch (error) {
      // tslint:disable-next-line:no-unused-expression
      expect(error).to.exist;
    }
  });
});

describe('SalesForce User Service: Integration', () => {
  const username = 'test1@affiniti.com.ana';
  const password = 'Network@ssure';

  let service: SalesForceUserService;

  beforeEach(function () {
    service = Container.get(SalesForceUserService);
  });

  it('Should Authenticate', function (done) {
    this.timeout(40000);

    service.authenticate(username, password).then(data => {
      // tslint:disable-next-line:no-unused-expression
      expect(data).to.not.be.empty;
      expect(data).to.have.property('User');
      done();
    }).catch(err => {
      expect.fail(false, true, `Error happened on authenticate:\n ${err}`)
      done();
    });
  });

   it('Should Get Accounts', function (done) {
    this.timeout(40000);
    const testAccountId = '0015400000Chh1OAAR';

    service.getAccounts(testAccountId).then(data => {
      // tslint:disable-next-line:no-unused-expression
      expect(data).to.not.be.empty;
      expect(data.length).to.be.greaterThan(0);
      // tslint:disable-next-line:no-unused-expression
      expect(data[0]).to.not.be.empty;
      expect(data[0]).to.have.property('Id');
      expect(data[0]).to.have.property('GroupId');
      expect(data[0]).to.have.property('GroupName');
      done();
    });
  });

  it('Should Get Accounts with Sub Account Array', function (done) {
    this.timeout(40000);
    const testAccountId = '0015400000Chh1OAAR';
    const testSubAccount = new Account({
      name: 'Grandchild Account 1',
      accountId: '0015400000CgvizAAB',
      groupName: 'TX-AFF-AFTXHQ',
      groupId: '15'
    });
    const testSubAccounts = [testSubAccount];

    service.getAccounts(testAccountId, testSubAccounts).then(data => {
      // tslint:disable-next-line:no-unused-expression
      expect(data).to.not.be.empty;
      expect(data.length).to.be.greaterThan(0);
      // tslint:disable-next-line:no-unused-expression
      expect(data[0]).to.not.be.empty;
      expect(data[0]).to.have.property('Id');
      expect(data[0]).to.have.property('GroupId');
      expect(data[0]).to.have.property('GroupName');
      done();
    });
  });

  /** @todo: The following 3 tests modify data on Salesforce. Can't really test that easily */
  it('Should Get And Send Temp Password', function () {
    this.skip();
  });

  it('Should Set New Password', function () {
    this.skip();
  });

  it('Should Get Temp Password', function () {
    this.skip();
  });
});
