import { Component, Injector, OnInit } from '@angular/core';

import { ReportsService } from '../../../services';
import { Utilization } from '../../../models/zabbix';
import { WidgetComponent } from '../../../containers';

@Component({
  selector: 'managed-devices-history',
  templateUrl: 'managed-devices-history.component.html',
  styleUrls: [
    'managed-devices-history.component.scss'
  ]
})
export class ManagedDevicesHistoryComponent extends WidgetComponent implements OnInit {
  public model: Utilization[];
  public cols: Array<any>;
  constructor(
    private injector: Injector,
    private reportsService: ReportsService
  ) {
    super(injector);
    this.cols = [
      {field: 'hostname', header: 'Name'},
      {field: 'mostRecentActivation', header: 'Managed Turned On'},
      {field: 'isManaged', header: 'Currently Managed'}
    ];
  }

  public ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.Working();

    this.reportsService.getManagedDevices().subscribe(x => {
      this.model = x;
      this.Ready();
    });
  }
}
