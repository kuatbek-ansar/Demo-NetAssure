import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { SupportCase, SupportCaseComment } from '../../../models';
import { HttpService } from './http.service';

@Injectable()
export class SupportCasesService extends HttpService {
  constructor(private injector: Injector) {
    super(injector);
  }

  get(): Observable<SupportCase[]> {
    return super.get(this.ApiUrls.GetAllSupportCases);
  }

  getDetails(caseNumber: string): Observable<SupportCase[]> {
    return super.get(this.generateUrl(this.ApiUrls.GetSupportCaseDetails, {caseno: caseNumber}));
  }

  getComments(caseID: string, startIndex: number = 0, rowCount: number = 1): Observable<SupportCase[]> {
    return super.get(this.generateUrl(this.ApiUrls.GetSupportCaseComments, {caseid: caseID, start: startIndex, count: rowCount}));
  }

  getPicklistValues(fieldName: string): Observable<String[]> {
    return super.get(this.generateUrl(this.ApiUrls.GetSupportCasePicklistValues, {fieldName}));
  }

  public create(supportCase: SupportCase): Observable<void> {
    return super.put(this.ApiUrls.CreateSupportCase, supportCase);
  }

  public createComment(caseComment: SupportCaseComment): Observable<void> {
    return super.put(this.ApiUrls.CreateSupportCaseComment, caseComment);
  }
}
