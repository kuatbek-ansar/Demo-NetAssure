import { SalesForceStrings } from './salesforce.strings';
import { expect } from 'chai'

describe('Salesforce Strings: Unit', function () {
    describe('Authenticate SOAP', function () {
        it('should have envelope', function () {
            const authSoap = SalesForceStrings.AuthenticateSoap;
            const result = authSoap.search(/(\<).+(Envelope)/g);
            expect(result).to.be.above(0);
        });

        it('should have header', function () {
            const authSoap = SalesForceStrings.AuthenticateSoap;
            const result = authSoap.search(/(\<).+(Header)/g);
            expect(result).to.be.above(0);
        });

        it('should have LoginScopeHeader', function () {
            const authSoap = SalesForceStrings.AuthenticateSoap;
            const result = authSoap.search(/(\<).+(LoginScopeHeader)/g);
            expect(result).to.be.above(0);
        });

        it('should have body', function () {
            const authSoap = SalesForceStrings.AuthenticateSoap;
            const result = authSoap.search(/(\<).+(Body)/g);
            expect(result).to.be.above(0);
        });

        it('should have login', function () {
            const authSoap = SalesForceStrings.AuthenticateSoap;
            const result = authSoap.search(/(\<login)/g);
            expect(result).to.be.above(0);
        });

        it('should have username', function () {
            const authSoap = SalesForceStrings.AuthenticateSoap;
            const result = authSoap.search(/(\<username\>)/g);
            expect(result).to.be.above(0);
        });

        it('should have password', function () {
            const authSoap = SalesForceStrings.AuthenticateSoap;
            const result = authSoap.search(/(\<password\>)/g);
            expect(result).to.be.above(0);
        });
    });

    describe('Get Self Service User', function () {
        it('should have select fields', function () {
            const selfService = SalesForceStrings.GetSelfServiceUser;
            const result = selfService.search(/(select|SELECT).+(Id).+(ContactID).+(Email).+(Username).+(SuperUser)/g);
            expect(result).to.be.above(0);
        });

        it('should select from correct table', function () {
            const selfService = SalesForceStrings.GetSelfServiceUser;
            const result = selfService.search(/(from|FROM).+(SelfServiceUser)/g);
            expect(result).to.be.above(0);
        });

        it('should use where clause', function () {
            const selfService = SalesForceStrings.GetSelfServiceUser;
            const result = selfService.search(/(where|WHERE).+(Username).+(IsActive)/g);
            expect(result).to.be.above(0);
        });
    });

    describe('Get Account', function () {
        it('should have select fields', function () {
            const account = SalesForceStrings.GetAccount;
            const result = account.search(/(select|SELECT).+(Id).+\n?.+(Email).+\n?.+(FirstName).+\n?.+(Account\.Name).+\n?.+(Account\.Id).+\n?.+(Account\.ParentId).+\n?.+(Account\.Monitor_Abbrev__c).+\n?.+(Account\.Monitor_Abbrev_Id__c)/g);
            expect(result).to.be.above(0);
        });
        
        it('should select from correct table', function () {
            const account = SalesForceStrings.GetAccount;
            const result = account.search(/(from|FROM).+(Contact)/g);
            expect(result).to.be.above(0);
        });

        it('should use where clause', function () {
            const account = SalesForceStrings.GetAccount;
            const result = account.search(/(where|WHERE).+(Id)/g);
            expect(result).to.be.above(0);
        });
    });

    describe('Get Account By Parent Id', function () {
        it('should have select fields', function () {
            const account = SalesForceStrings.GetAccountsByParentId;
            const result = account.search(/(select|SELECT).+(Id).+\n?.+(Name).+\n?.+(ParentId).+\n?.+(Monitor_Abbrev__c).+\n?.+(Monitor_Abbrev_Id__c)/g);
            expect(result).to.be.above(0);
        });
        
        it('should select from correct table', function () {
            const account = SalesForceStrings.GetAccountsByParentId;
            const result = account.search(/(from|FROM).+(Account)/g);
            expect(result).to.be.above(0);
        });

        it('should use where clause', function () {
            const account = SalesForceStrings.GetAccountsByParentId;
            const result = account.search(/(where|WHERE).+(Monitor_Abbrev_Id__c).+\n?.+(ParentId)/g);
            expect(result).to.be.above(0);
        });
    });

    describe('Get All Support Cases', function () {
        it('should have select fields', function () {
            const cases = SalesForceStrings.GetAllSupportCases;
            const result = cases.search(/(select|SELECT).+(Id).+\n?.+(ContactId).+\n?.+(Contact\.Name).+\n?.+(CaseNumber).+\n?.+(Subject).+\n?.+(Severity__c).+\n?.+(Status).+\n?.+(Priority).+\n?.+(CreatedDate).+\n?.+(Site_Id__c)/g);
            expect(result).to.be.above(0);
        });
        
        it('should select from correct table', function () {
            const cases = SalesForceStrings.GetAllSupportCases;
            const result = cases.search(/(from|FROM).+(Case)/g);
            expect(result).to.be.above(0);
        });

        it('should use where clause', function () {
            const cases = SalesForceStrings.GetAllSupportCases;
            const result = cases.search(/(where|WHERE).+(AccountId)/g);
            expect(result).to.be.above(0);
        });
    });

    describe('Get Support Case Details', function () {
        it('should have select fields', function () {
            const caseDetail = SalesForceStrings.GetSupportCaseDetails;
            const result = caseDetail.search(/(select|SELECT).+(Customer__c).+\n?.+(Product__c).+\n?.+(Users_Impacted__c).+\n?.+(Origin).+\n?.+(Type__c).+\n?.+(Type).+\n?.+(OwnerId).+\n?.+(Owner\.Name).+\n?.+(Description).+\n?.+(Resolution_Fix_Action__c).+\n?.+(ClosedDate).+\n?.+(Escalate_to_Engineering__c)/g);
            expect(result).to.be.above(0);
        });
        
        it('should select from correct table', function () {
            const caseDetail = SalesForceStrings.GetSupportCaseDetails;
            const result = caseDetail.search(/(from|FROM).+(Case)/g);
            expect(result).to.be.above(0);
        });

        it('should use where clause', function () {
            const caseDetail = SalesForceStrings.GetSupportCaseDetails;
            const result = caseDetail.search(/(where|WHERE).+(CaseNumber)/g);
            expect(result).to.be.above(0);
        });
    });

    describe('Get Support Case Comments', function () {
        it('should have select fields', function () {
            const caseDetail = SalesForceStrings.GetSupportCaseComments;
            const result = caseDetail.search(/(select|SELECT).+(CreatedDate).+\n?.+(CreatedBy\.FirstName).+\n?.+(CreatedBy\.LastName).+\n?.+(CommentBody)/g);
            expect(result).to.be.above(0);
        });
        
        it('should select from correct table', function () {
            const caseDetail = SalesForceStrings.GetSupportCaseComments;
            const result = caseDetail.search(/(from|FROM).+(CaseComment)/g);
            expect(result).to.be.above(0);
        });

        it('should use where clause', function () {
            const caseDetail = SalesForceStrings.GetSupportCaseComments;
            const result = caseDetail.search(/(where|WHERE).+(ParentId).+\n?.+(IsPublished).+\n?.+(true|TRUE).+\n?.+(IsDeleted).+\n?.+(false|FALSE)/g);
            expect(result).to.be.above(0);
        });

        it('should use order by clause', function () {
            const caseDetail = SalesForceStrings.GetSupportCaseComments;
            const result = caseDetail.search(/(order|ORDER) (by|BY).+(CreatedDate) ?\n?.+?(desc|DESC)/g);
            expect(result).to.be.above(0);
        });

        it('should use limit clause', function () {
            const caseDetail = SalesForceStrings.GetSupportCaseComments;
            const result = caseDetail.search(/(limit|LIMIT)/g);
            expect(result).to.be.above(0);
        });

        it('should use offset clause', function () {
            const caseDetail = SalesForceStrings.GetSupportCaseComments;
            const result = caseDetail.search(/(offset|OFFSET)/g);
            expect(result).to.be.above(0);
        });
    });

    describe('Error Messages', function() {
        it('MissingGroupId should include phone number', function() {
            const missing = SalesForceStrings.MissingGroupId;
            const result = missing.search(/(877-334-4096)/g);
            expect(result).to.be.above(0);
        });

        it('MissingCredentials should not be empty', function() {
            const missingCreds = SalesForceStrings.MissingCredentials;
            expect(missingCreds).to.not.be.empty;
        });

        it('InvalidCredentials should not be empty', function() {
            const invalidCreds = SalesForceStrings.InvalidCredentials;
            expect(invalidCreds).to.not.be.empty;
        });

        it('PasswordExpired should not be empty', function() {
            const passExpired = SalesForceStrings.PasswordExpired;
            expect(passExpired).to.not.be.empty;
        });

        it('CannotFindUserId should not be empty', function() {
            const noUserId = SalesForceStrings.CannotFindUserId;
            expect(noUserId).to.not.be.empty;
        });

        it('NoTempPassword should not be empty', function() {
            const noTempPwd = SalesForceStrings.NoTempPassword;
            expect(noTempPwd).to.not.be.empty;
        });
    });
});