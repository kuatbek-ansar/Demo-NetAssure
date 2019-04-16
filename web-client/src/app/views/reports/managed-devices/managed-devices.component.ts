import { Component, Injector, OnInit } from '@angular/core';

import { ReportsService } from '../../../services';
import { Utilization } from '../../../models/zabbix';
import { WidgetComponent } from '../../../containers';

@Component({
  selector: 'managed-devices',
  templateUrl: 'managed-devices.component.html',
  styleUrls: [
    'managed-devices.component.scss'
  ]
})
export class ManagedDevicesComponent extends WidgetComponent implements OnInit {
  public model: Utilization[];
  public cols: Array<any>;
  constructor(
    private injector: Injector,
    private reportsService: ReportsService
  ) {
    super(injector);
    this.cols = [
      {field: 'hostname', header: 'Name'},
      {field: 'mostRecentActivation', header: 'Managed Turned On'}
    ];
  }

  public ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.Working();

    this.reportsService.getManagedDevices().subscribe(x => {
      this.model = x.filter(device => device.isManaged);
      this.Ready();
    });
  }
}
