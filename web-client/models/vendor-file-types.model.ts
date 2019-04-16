export class VendorFileTypes {
  public Id: string;

  public FileType: string;

  constructor(init: any = {}) {
    this.Id = init.Id || init.vendor_id;
    this.FileType = init.type || init.fileType;
  }
}
