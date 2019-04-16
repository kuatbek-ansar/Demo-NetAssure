import { Injectable, Injector } from '@angular/core';
import { HttpService } from './http.service';
import { Circuit } from '../../../models/circuit.model';
import { Observable } from 'rxjs/Observable';
import { DeviceCount } from '../models/device-count.model';
import { CircuitPredictive } from '../../../models';

@Injectable()
export class CircuitPredictiveService extends HttpService {
  constructor(
    private injector: Injector
  ) {
    super(injector);
  }

  getCircuitPredictive(circuitId: string): Observable<CircuitPredictive> {
    return this.get(`${this.ApiUrls.CircuitPredictive}/${circuitId}`);
  }
}
