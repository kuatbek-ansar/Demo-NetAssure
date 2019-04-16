import { isNullOrUndefined } from 'util';

/**
 * Represents a Support Case object in Salesforce
 */
export class SupportCase {
  public Id: string;

  public Number: string;

  public Subject: string;

  public Severity: string;

  public Status: string;

  public Priority: string;

  public CreatedDate: Date;

  public ContactId: string;

  public ContactName: string;

  public Site: string;

  public Customer: string;

  public Service: string;

  public UsersImpacted: string;

  public Origin: string;

  public Type: string;

  public OwnerId: string;

  public OwnerName: string;

  public Description: string;

  public EscalateToEngineering: boolean;

  public ResolutionFixAction: string;

  public ClosedDate: Date;

  constructor(init: any = {}) {
    this.Id = init.Id;
    this.Number = init.CaseNumber || init.Number;
    this.Subject = init.Subject;
    this.Severity = init.Severity__c || init.Severity;
    this.Status = init.Status;
    this.Priority = init.Priority;
    if (!isNullOrUndefined(init.CreatedDate)) {
      this.CreatedDate = new Date(Date.parse(init.CreatedDate));
    }
    this.ContactId = init.ContactId;
    if (!isNullOrUndefined(init.Contact)) {
      this.ContactName = init.Contact.Name || init.ContactName;
    } else {
      this.ContactName = init.ContactName;
    }
    this.Site = init.Site_ID__c || init.Site;

    this.fillDetails(init);
  }

  public fillDetails(init: any) {
    this.Customer = init.Customer__c || init.Customer;
    this.Service = init.Product__c || init.Service;
    this.UsersImpacted = init.Users_Impacted__c || init.UsersImpacted;
    this.Origin = init.Origin;
    this.Type = init.Type__c || init.Type;
    this.OwnerId = init.OwnerId;
    if (!isNullOrUndefined(init.Owner)) {
      this.OwnerName = init.Owner.Name || init.OwnerName;
    } else {
      this.OwnerName = init.OwnerName;
    }
    this.Description = init.Description;
    this.EscalateToEngineering = isNullOrUndefined(init.Escalate_to_Engineering__c) ?
                                  init.EscalateToEngineering :
                                  init.Escalate_to_Engineering__c;
    this.ResolutionFixAction = init.Resolution_Fix_Action__c || init.ResolutionFixAction;
    if (!isNullOrUndefined(init.ClosedDate)) {
      this.ClosedDate = new Date(Date.parse(init.ClosedDate));
    }
  }
}

export class SupportCaseComment {
  public Created: string;

  public CommentBody: string;

  public ParentId: string;

  constructor(init: any) {
    if (!isNullOrUndefined(init.CreatedDate)) {
      this.Created = new Date(Date.parse(init.CreatedDate)).toLocaleString('en-US');
    } else {
      this.Created = init.Created;
    }
    if (!isNullOrUndefined(init.CreatedBy)) {
      this.Created += '  ' + init.CreatedBy.FirstName + ' ' + init.CreatedBy.LastName;
    } else if (!isNullOrUndefined(init.CreatorName)) {
      this.Created += init.CreatorName;
    }
    this.CommentBody = init.CommentBody;
    this.ParentId = init.ParentId;
  }
}
