import { VendorFileTypes } from './';
import {Vendor} from './vendor.model';

export class VendorFiles {
  public Id: string;

  public GroupId: number;

  public FileName: string;

  public FileType: VendorFileTypes;

  public Location: string;

  public HasSla: boolean;

  public UploadedDate: Date;

  constructor(init: any = {}) {
    this.Id = init.Id || init.vendor_id;
    this.GroupId = init.group_id || init.groupId
    this.FileName = init.name || init.fileName;
    this.FileType = init.type || init.fileType;
    this.Location = init.location || init.fileLocation;
    this.HasSla = init.hasSla || false;
    this.UploadedDate = init.uploadedDate || init.uploaded || null;
  }
}
