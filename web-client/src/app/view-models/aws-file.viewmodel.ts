import { AwsFile } from '../../../models';

export class AwsFileViewModel extends AwsFile {
  public lastModifiedDateStamp: number;

  public confirmDelete: boolean;

  constructor() {
    super();
  }
}
