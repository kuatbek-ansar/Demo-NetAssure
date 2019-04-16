import { Injectable, Injector } from '@angular/core';

import { HttpService } from './http.service';

@Injectable()
export class IfaceService extends HttpService {
  constructor(
    private injector: Injector
  ) {
    super(injector);
  }
}
