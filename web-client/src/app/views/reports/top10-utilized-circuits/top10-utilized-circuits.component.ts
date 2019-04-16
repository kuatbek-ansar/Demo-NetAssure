import { Component, Injector, OnInit } from '@angular/core';

import { ReportsService } from '../../../services';
import { Utilization } from '../../../models/zabbix';
import { WidgetComponent } from '../../../containers';

@Component({
  selector: 'top10-utilized-circuits',
  templateUrl: 'top10-utilized-circuits.component.html',
  styleUrls: [
    'top10-utilized-circuits.component.scss'
  ]
})
export class Top10UtilizedCircuitsComponent extends WidgetComponent implements OnInit {
  public upstream: Utilization[];
  public downstream: Utilization[];
  public upstreamCols: Array<any>;
  public downstreamCols: Array<any>;

  constructor(
    private injector: Injector,
    private reportsService: ReportsService
  ) {
    super(injector);
    this.upstreamCols = [
      { field: 'hostname', header: 'Host'},
      { field: 'name', header: 'Interface'},
      { field: 'circuit.name', header: 'Display Name'},
      { field: 'bitsSent', header: 'Send (mbits)'},
      { field: 'speed', header: 'Capacity (mbits)'},
      { field: 'upstreamUtilization', header: 'Utilization'}
    ];
    this.downstreamCols = [
      { field: 'hostname', header: 'Host'},
      { field: 'name', header: 'Interface'},
      { field: 'circuit.name', header: 'Display Name'},
      { field: 'bitsSent', header: 'Send (mbits)'},
      { field: 'speed', header: 'Capacity (mbits)'},
      { field: 'downstreamUtilization', header: 'Utilization'}
    ];
  }

  public ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.Working();

    this.reportsService.getTop10UtilizedCircuits().subscribe(x => {
      this.upstream = x.top10Upstream;
      this.downstream = x.top10Downstream;
      this.Ready();
    });
  }
}
