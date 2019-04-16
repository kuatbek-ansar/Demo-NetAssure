import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpRestParams } from '../models';
import { HttpService } from './http.service';
import { NetworkMap } from '../../../models';
import { NetworkMapViewModel } from '../view-models';
import { StateService } from './state.service';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class NetworkMapService extends HttpService {
  constructor(
    private injector: Injector,
    private stateService: StateService
  ) {
    super(injector);
  }

  public get(): Observable<NetworkMap[]> {
    return super.get(this.ApiUrls.NetworkMaps);
  }

  public getSignedImage(imageUrl: string): Observable<any> {

    const params = new HttpParams().set('fileName', encodeURIComponent(imageUrl));

    return super.get(`${this.ApiUrls.NetworkMapSignedImages}`, { params : params});
  }

  public upload(model: NetworkMapViewModel): void {
    model.fileUpload.SetOptions(
      `${this.configService.GetApiUrl(this.ApiUrls.UploadNetworkMap)}/${this.stateService.User.HostGroup.Id}`,
      this.stateService.GetToken());
    model.fileUpload.SetHeaders([
      {name: 'Name', value: model.name}
    ]);
    model.fileUpload.Upload();
  }

  public deleteMap(id: number): Observable<any> {
    return super.delete(`${this.ApiUrls.NetworkMaps}/${id}`);
  }
}
