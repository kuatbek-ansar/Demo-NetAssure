import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Graph } from '../../../models/graph.model';
import { HttpService } from './http.service';

@Injectable()
export class GraphService extends HttpService {
  constructor(
    private injector: Injector
  ) {
    super(injector);
  }

  getHostGraphs(host): Observable<Graph[]> {
    return super.post(this.ApiUrls.GetHostGraphs, host)
  }
}
