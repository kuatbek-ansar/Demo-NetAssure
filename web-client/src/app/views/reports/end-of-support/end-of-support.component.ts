import { Component, Injector, OnInit } from '@angular/core';

import { ReportsService } from '../../../services';
import { EndOfSupport } from '../../../models/zabbix';
import { WidgetComponent } from '../../../containers';

@Component({
  selector: 'end-of-support',
  templateUrl: 'end-of-support.component.html',
  styleUrls: [
    'end-of-support.component.scss'
  ]
})
export class EndOfSupportComponent extends WidgetComponent implements OnInit {
  public model: EndOfSupport[];
  public cols: Array<any>;
  public total: number;

  constructor(
    private injector: Injector,
    private reportsService: ReportsService
  ) {
    super(injector);
    this.cols = [
      { field: 'hostname', header: 'Device Name'},
      { field: 'vendor', header: 'Vendor'},
      { field: 'hw_pn', header: 'Part Number'},
      { field: 'hw_desc', header: 'Description'},
      { field: 'eos', header: 'End of Support'},
      { field: 'new_pn', header: 'Replacement Part Number'},
      { field: 'new_desc', header: 'Replacement Description'},
      { field: 'newEquipmentCost', header: 'Replacement Cost'}
    ];
  }

  public ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.Working();

    this.reportsService.getEndOfSupport().subscribe(x => {
      this.model = x;
      this.total = this.model.reduce((acc, curr) => acc + curr.newEquipmentCost, 0)
      this.Ready();
    });
  }
}
