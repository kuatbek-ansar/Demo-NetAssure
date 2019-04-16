import 'reflect-metadata';
import { Container } from 'typedi/Container';

import { SalesForceSupportCaseService } from './salesforce-support-case.service';
import { User, Account, SalesforceAuth } from '../../models/index';

import { expect } from 'chai'

describe('SalesForce Support Case Service: Integration', () => {
  let service: SalesForceSupportCaseService;

  // These tests are not robust, but about all we can do with the direct integration with SF in the services
  const fakeUser: User = new User();
  fakeUser.Account = new Account({
    name: 'Test Account',
    accountId: '0015400000Chh1OAAR'
  });

  fakeUser.SalesforceAuth = new SalesforceAuth({
    ContactId: '0035400000BXqM5AAL'
  });

  beforeEach(function () {
    service = Container.get(SalesForceSupportCaseService);
  });

  it('Should Get All Support Cases', function (done) {
    this.timeout(40000);
    try {
      service.getAllSupportCases(fakeUser).then(data => {
        // tslint:disable-next-line:no-unused-expression
        expect(data).to.not.be.null;
        done();
      });
    } catch (e) {
      expect.fail(false, true, `Execption thrown: ${e}`);
      done();
    }
  });

  it('Should Get Support Case Details', function (done) {
    this.timeout(40000);
    // Case number taken from SF.com at random... HIGHLY volitile test!
    const testCaseNumber = '0053281';
    try {
      service.getSupportCaseDetails(testCaseNumber).then(data => {
        // tslint:disable-next-line:no-unused-expression
        expect(data).to.not.be.empty;
        expect(data).to.have.property('Customer');
        expect(data).to.have.property('Service');
        expect(data).to.have.property('UsersImpacted');
        expect(data).to.have.property('Origin');
        expect(data).to.have.property('Type');
        expect(data).to.have.property('OwnerId');
        expect(data).to.have.property('Description');
        expect(data).to.have.property('ResolutionFixAction');
        expect(data).to.have.property('EscalateToEngineering');

        expect(data).to.have.any.keys('Owner', 'OwnerName');
        done();
      })
    } catch (e) {
      expect.fail(false, true, `Execption thrown: ${e}`);
      done();
    }
  });

  it('Should Get Support Case Comments', function (done) {
    this.timeout(40000);
    // Case number taken from SF.com at random... HIGHLY volitile test!
    const testCaseId = '50054000001ucRQ';
    try {
      service.getSupportCaseComments(testCaseId, 0, 10).then(data => {
        // tslint:disable-next-line:no-unused-expression
        expect(data).to.not.be.empty;
        // tslint:disable-next-line:no-unused-expression
        expect(data[0]).to.not.be.empty;
        expect(data[0]).to.have.property('Created');
        expect(data[0]).to.have.property('CommentBody');
        expect(data[0]).to.have.property('ParentId');
        done();
      });
    } catch (e) {
      expect.fail(false, true, `Execption thrown: ${e}`);
      done();
    }
  });

  it('Should Get Support Case Picklist Values', function(done) {
    this.timeout(40000);
    // We use one of these as a parameter to the picklist field in the app
    // Product__c, Severity__c, Users_Impacted__c
    const testFieldName = 'Product__c';

    try {
      service.getSupportCasePicklistValues(testFieldName).then(data => {
        // tslint:disable-next-line:no-unused-expression
        expect(data).to.not.be.empty; // so long as we get something back
        done();
      });
    } catch (e) {
      expect.fail(false, true, `Execption thrown: ${e}`);
      done();
    }
  });

  it('Should Create Support Case', function() {
    this.skip()
  });

  it('Should Create Support Case Comment', function() {
    this.skip();
  });
});
