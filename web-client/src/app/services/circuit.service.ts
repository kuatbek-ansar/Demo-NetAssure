import { Injectable, Injector } from '@angular/core';
import { HttpService } from './http.service';
import { Circuit } from '../../../models/circuit.model';
import { Observable } from 'rxjs/Observable';
import { DeviceCount } from '../models/device-count.model';

@Injectable()
export class CircuitService extends HttpService {
  constructor(
    private injector: Injector
  ) {
    super(injector);
  }

  addCircuit(circuit) {
    return super.post(this.ApiUrls.Circuits, circuit);
  }

  getCircuitsFromDevice(hostId: string): Observable<Circuit[]> {
    return super.get(`${this.ApiUrls.Circuits}/host/${hostId}`).map(cs => cs.map(c => new Circuit(c)));
  }

  getAllCircuits(): Observable<Circuit[]> {
    return super.get(this.ApiUrls.Circuits).map(cs => cs.map(c => new Circuit(c)));
  }

  deleteCircuit(circuit: Circuit): Observable<Object> {
    return super.delete(`${this.ApiUrls.Circuits}/${circuit.circuit_id}`);
  }

  getCount(): Observable<DeviceCount> {
    const startOfDay = new Date();
    startOfDay.setHours(0);
    startOfDay.setMinutes(0);
    startOfDay.setSeconds(0);
    startOfDay.setMilliseconds(0);
    return this.get(`${this.ApiUrls.Circuits}/count?since_date=${encodeURIComponent(startOfDay.toISOString())}`);
  }
}
