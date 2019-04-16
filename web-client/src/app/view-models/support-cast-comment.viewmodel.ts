import { SupportCaseComment } from '../../../models';

export class SupportCaseCommentViewModel extends SupportCaseComment {
  public IsSelected: boolean;

  public constructor(init: any) {
    super(init);
  }
}
