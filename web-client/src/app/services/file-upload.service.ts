import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpRestParams } from '../models/http-rest-params.model';
import { HttpService } from './http.service';
import { NetworkMap } from '../../../models/network-map.model';
import { StateService } from './state.service';
import { FileUpload } from '../models/file-upload.model';

@Injectable()
export class FileUploadService extends HttpService {
  constructor(
    private injector: Injector,
    private stateService: StateService
  ) {
    super(injector);
  }

  /*
  public upload(file: FileUpload): Observable<void> {
    file.upload();
  }
  */
}
