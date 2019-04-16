import { SupportCase } from '../../../models';
import { SupportCaseCommentViewModel } from './support-cast-comment.viewmodel';

export class SupportCaseViewModel extends SupportCase {
  public IsSelected: boolean;

  public DateForFiltering: String;

  public Comments: SupportCaseCommentViewModel[];

  public constructor(init: any = {}) {
    super(init);

    this.DateForFiltering = init.DateForFiltering;
  }
}
