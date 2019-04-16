import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { HttpService } from './http.service';
import { EndOfSupport, Utilization } from '../models/zabbix';
import { Layer7ViewModel } from '../models/layer7.viewmodel';
import { Circuit } from '../../../models';
import { Layer7SrcAddressViewModel } from '../models/layer7-src-address.viewmodel';

class Top10 {
  top10Upstream: Utilization[];
  top10Downstream: Utilization[];
}

class Bottom10 {
  bottom10Upstream: Utilization[];
  bottom10Downstream: Utilization[];
}


@Injectable()
export class ReportsService extends HttpService {
  constructor(
    private injector: Injector) {
    super(injector);
  }

  public getTop10UtilizedCircuits(): Observable<Top10> {
    return super.get(`report/top10UtilizedCircuits`);
  }

  public getBottom10UtilizedCircuits(): Observable<Bottom10> {
    return super.get(`report/bottom10UtilizedCircuits`);
  }

  public getTop10UtilizedInterfaces(): Observable<Top10> {
    return super.get(`report/top10UtilizedInterfaces`);
  }

  public getBottom10UtilizedInterfaces(): Observable<Bottom10> {
    return super.get(`report/bottom10UtilizedInterfaces`);
  }

  public getEndOfSupport(): Observable<Array<EndOfSupport>> {
    return super.get(`report/devicesPastEndOfSupport`);
  }

  public getApproachingEndOfSupport(): Observable<Array<EndOfSupport>> {
    return super.get(`report/devicesApproachingEndOfSupport`);
  }

  public getManagedDevices(): Observable<Array<any>> {
    return super.get(`managed-device/`);
  }

  public getLayer7(): Observable<Array<Layer7ViewModel>> {
    return super.get(`report/layer7/`);
  }

  public getLayer7ForProtocol(protocol: string): Observable<Array<Layer7SrcAddressViewModel>> {
    return super.get(`report/layer7/protocol/${protocol}`);
  }

  public getCircuits(): Observable<Array<Circuit>> {
    return super.get('circuit').map(cs => cs.map(c => new Circuit(c)));
  }

  public getTopTalkers(): Observable<Array<Layer7ViewModel>> {
    return super.get(`report/topTalkers/`);
  }
}
