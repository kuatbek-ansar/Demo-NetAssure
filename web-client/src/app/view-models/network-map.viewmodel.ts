import { FileUpload } from '../models/file-upload.model';
import { NetworkMap } from '../../../models/network-map.model';

export class NetworkMapViewModel extends NetworkMap {
  public fileUpload: FileUpload;

  public confirmDelete: boolean;

  constructor() {
    super();

    this.fileUpload = new FileUpload();
  }
}
