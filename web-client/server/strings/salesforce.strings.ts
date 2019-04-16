export class SalesForceStrings {
  static AuthenticateSoap = `
  <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
    <s:Header>
        <h:LoginScopeHeader
            xmlns:h="urn:partner.soap.sforce.com"
            xmlns="urn:partner.soap.sforce.com"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <organizationId>{0}</organizationId>
        </h:LoginScopeHeader>
    </s:Header>
    <s:Body
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <login xmlns="urn:partner.soap.sforce.com">
            <username>{1}</username>
            <password>{2}</password>
        </login>
    </s:Body>
  </s:Envelope>`;

  static GetSelfServiceUser = `
  select  Id, ContactID, Email, Username, SuperUser
  from    SelfServiceUser
  where   Username = '{0}' and IsActive = true`;

  static GetAccount = `
  select  Id,
          Email,
          FirstName,
          Account.Name,
          Account.Id,
          Account.ParentId,
          Account.Monitor_Abbrev__c,
          Account.Monitor_Abbrev_Id__c,
          Contact_Function__c
  from    Contact
  where   Id = '{0}'`;

  static GetAccountsByParentId = `
  select  Id,
          Name,
          ParentId,
          Monitor_Abbrev__c,
          Monitor_Abbrev_Id__c
  from    Account
  where   Monitor_Abbrev_Id__c <> ''
          and ParentId = '{0}'`;

  static GetAllSupportCases = `
  select  Id, ContactId, Contact.Name, CaseNumber, Subject,
          Severity__c, Status, Priority, CreatedDate, Site_Id__c
  from    Case
  where   AccountId = '{0}'`;

  static GetSupportCaseDetails = `
  select  Customer__c, Product__c, Users_Impacted__c,
          Origin, Type__c, Type, OwnerId, Owner.Name, Description,
          Resolution_Fix_Action__c, ClosedDate, Escalate_to_Engineering__c
  from    Case
  where   CaseNumber = '{0}'`;

  static SuperUserWhereClause = `and ContactId = '{0}'`;

  static GetSupportCaseComments = `
  select    CreatedDate, CreatedBy.FirstName, CreatedBy.LastName, CommentBody
  from      CaseComment
  where     ParentId = '{0}' and IsPublished = true and IsDeleted = false
  order by  CreatedDate DESC
  limit     {2}
  offset    {1}`;

  static GetGroupBillingPostalCodes = `
  select id,
         name,
         BillingPostalCode,
         Monitor_Abbrev_Id__c
    from Account
   where Monitor_Abbrev_Id__c != null
     and BillingPostalCode != null`

 static GetGroupBillingPostalCode = `
  select id,
         name,
         BillingPostalCode,
         Monitor_Abbrev_Id__c
    from Account
   where Monitor_Abbrev_Id__c = '{0}'
     and BillingPostalCode != null`

  static MissingGroupId = 'Customer not setup on portal, please call Affiniti Network Assure at 877-334-4096';

  static MissingCredentials = 'Missing Username or Password';

  static InvalidCredentials = 'Invalid credentials, please try again.';

  static PasswordExpired = 'The password has expired. You must set a new password now';

  static CannotFindUserId = 'Unable to find the UserId. Are you setup with Self-Service?';

  static NoTempPassword = 'Unable to get a temporary password at this time, please try again later';
}
