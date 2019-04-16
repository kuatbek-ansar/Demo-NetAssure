import { Inject } from 'typedi';

import { SalesForceSupportCaseService, LogService } from '../../services';
import { User, SupportCase, SupportCaseComment } from '../../../models';
import { Path, GET, QueryParam, Errors, Context, ServiceContext, PUT } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Support Cases')
@Path('/support-case')
export class SupportCaseController {
  @Context
  context: ServiceContext;

  @Inject()
  private service: SalesForceSupportCaseService;

  @Inject()
  private logService: LogService;

  constructor() {
  }


  @GET
  @Path('/get')
  public async getAll(): Promise<any> {
    const user: User = this.context.request['user'];

    try {
      return await this.service.getAllSupportCases(user);
    } catch (e) {
      this.logService.error('Unable to get all Salesforce support cases', {user: user}, e);
      throw new Errors.InternalServerError(e);
    }
  };

  @GET
  @Path('/get-details')
  public async getDetails(@QueryParam('caseno') caseNumber: string): Promise<any> {
    try {
      return await this.service.getSupportCaseDetails(caseNumber);
    } catch (e) {
      this.logService.error('Unable to get Salesforce support case details', {caseNumber: caseNumber}, e);
      throw new Errors.InternalServerError(e)
    }
  }

  @GET
  @Path('/get-comments')
  public async getComments(@QueryParam('caseid') caseID: string,
                           @QueryParam('start') startIndex: number,
                           @QueryParam('count') rowCount: number): Promise<any> {
    try {
      return await this.service.getSupportCaseComments(caseID, startIndex, rowCount);
    } catch (e) {
      this.logService.error('Unable to get Salesforce support case comments', {caseId: caseID}, e);
      throw new Errors.InternalServerError(e)
    }
  }

  @GET
  @Path('/get-picklist-values')
  public async getPicklistValues(@QueryParam('fieldName') fieldName: string): Promise<any> {
    try {
      return await this.service.getSupportCasePicklistValues(fieldName);
    } catch (e) {
      this.logService.error('Unable to get Salesforce support case picklist values', {fieldName: fieldName}, e);
      throw new Errors.InternalServerError(e);
    }
  }

  @PUT
  @Path('/create')
  public async create(supportCase: SupportCase): Promise<SupportCase> {
    const user: User = this.context.request['user'];

    try {
      return await this.service.createSupportCase(user, supportCase);
    } catch (e) {
      this.logService.error('Unable to create Salesforce support case', {user: user}, e);
      throw new Errors.InternalServerError();
    }
  };

  @PUT
  @Path('/create-comment')
  public async createComment(caseComment: SupportCaseComment): Promise<SupportCaseComment> {
    try {
      return await this.service.createSupportCaseComment(caseComment);
    } catch (e) {
      this.logService.error('Unable to create Salesforce support case comment', {caseComment: caseComment}, e);
      throw new Errors.InternalServerError(e);
    }
  };
}
