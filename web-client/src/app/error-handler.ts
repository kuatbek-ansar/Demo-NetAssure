import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
declare var appInsights;

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error) {
    if (!environment.production) {
      console.log(error);
    }
    appInsights.trackException(error);
  }
}
