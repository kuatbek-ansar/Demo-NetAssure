import { Injectable, Injector } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { StateService } from './state.service';
import { Vendor } from '../../../models/vendor.model';
import { DocumentUrl } from '../../../server/modules/vendor/models/document-url';
import { VendorFiles, VendorFileTypes } from '../../../models';

@Injectable()
export class VendorService extends HttpService {
  constructor(
    private injector: Injector,
    private state: StateService
  ) {
    super(injector);
  }

  public get(): Observable<Vendor[]> {
    return super.get(`${this.ApiUrls.Vendor}/${this.state.User.Account.GroupId}`);
  }

  public getFiles(vendorName: string): Observable<VendorFiles[]> {
    const completeFiles = [];

    return super.get(`${this.ApiUrls.Vendor}/${this.state.User.Account.GroupId}/${vendorName}/files`)
      .map(x => {
        x.forEach(y => {
          const newFileType = new VendorFileTypes();
          newFileType.FileType = y.fileType.file_type;
          newFileType.Id = y.fileType.id

          const newFileProps = {
            Id: y.id,
            name: y.file_name,
            type: newFileType,
            location: y.file_location,
            hasSla: y.hasSla === 1 ? true : false,
            uploadedDate: y.uploaded_date
          };

          completeFiles.push(new VendorFiles(newFileProps));
        });

        return completeFiles;
      });
  }

  public downloadDocument(documentName: string ) {
     return super.get(`${this.ApiUrls.Vendor}/documentUrl?documentName=${documentName}`);
  }

  uploadFile(vendorName: string, filePayload: FormData): Observable<any> {
    const headers = new HttpHeaders();

    return super.post(
      `${this.ApiUrls.Vendor}/${this.state.User.Account.GroupId}/${vendorName}/files/upload`,
      filePayload,
      {headers: headers}
    );
  }

  save(vendor: Vendor) {
    return super.post(
      `${this.ApiUrls.Vendor}/${this.state.User.Account.GroupId}`,
      vendor
    );
  }

  deleteVendor(vendor: Vendor) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const options = {
      headers: headers,
      body: JSON.stringify(vendor)
    };

    return super.delete(
      `${this.ApiUrls.Vendor}/${this.state.User.Account.GroupId}`,
      options);
  }

  deleteFile(vendorName: string, file: VendorFiles) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const options = {
      headers: headers,
      body: JSON.stringify(file)
    };

    return super.delete(
      `${this.ApiUrls.Vendor}/${this.state.User.Account.GroupId}/${vendorName}/files/delete/${file.Id}`,
      options);
  }
}
