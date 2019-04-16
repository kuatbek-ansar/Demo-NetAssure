import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { ApiUrls } from '../models/api-urls.model';
import { ConfigService } from './config.service';
import { ApiErrorService } from './api-error.service';
import { Observable } from 'rxjs/Observable';
import { HttpRestParams } from '../models';
import '../../rxjs-imports';

@Injectable()
export class HttpService {
  protected ApiUrls: ApiUrls;

  protected configService: ConfigService;

  protected apiErrorService: ApiErrorService;

  private http: HttpClient;
  constructor(
    injector: Injector,
  ) {
    this.apiErrorService = injector.get(ApiErrorService);
    this.configService = injector.get(ConfigService);
    this.http = injector.get(HttpClient);
    this.ApiUrls = this.configService.Config.ApiUrls;
  }

  protected generateUrl(url: string, query?: any): string {
    if (typeof query === 'object') {
      return url + '?' + Object.keys(query).map( x => `${x}=${query[x]}`).join('&')
    } else if (query) {
      return `${url}/${query}`;
    }
  }

  public get(url: string, options?: any): Observable<any> {
    return this.http.get(this.configService.GetApiUrl(url), options)
      .catch(error => this.apiErrorService.HandleError(error));
  }

  public restGet(url: string, params?: HttpRestParams): Observable<any> {
    return this.http.get(`${this.configService.GetApiUrl(url)}/${params.toString()}`)
    .catch(error => this.apiErrorService.HandleError(error));
  }

  public post(url: string, data: any, options?: any): Observable<any> {
    return this.http.post(this.configService.GetApiUrl(url), data, options)
    .catch(error => this.apiErrorService.HandleError(error));
  }

  public put(url: string, data: any, options?: any): Observable<any> {
    return this.http.put(this.configService.GetApiUrl(url), data, options)
    .catch(error => this.apiErrorService.HandleError(error));
  }

  public delete(url: string, options?: any): Observable<any> {
    return this.http.delete(this.configService.GetApiUrl(url), options)
    .catch(error => this.apiErrorService.HandleError(error));
  }
}
