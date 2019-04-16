import { AwsVersionedFile } from '../../../models';

export class AwsVersionedFileViewModel extends AwsVersionedFile {
  public lastModifiedDateStamp: number;

  public confirmDelete: boolean;

  constructor() {
    super();
  }
}
