import { Component, Injector, OnInit } from '@angular/core';

import { SelectItem } from 'primeng/primeng';

import { ReportsService } from '../../../services';
import { EndOfSupport } from '../../../models/zabbix';
import { WidgetComponent } from '../../../containers';

@Component({
  selector: 'approaching-end-of-support',
  templateUrl: 'approaching-end-of-support.component.html',
  styleUrls: [
    'approaching-end-of-support.component.scss'
  ]
})
export class ApproachingEndOfSupportComponent extends WidgetComponent implements OnInit {
  public model: EndOfSupport[];

  public rows: EndOfSupport[];
  public cols: Array<any>;
  public total: number;

  public daysAhead: SelectItem[];

  public filterDaysAhead = '30';

  constructor(
    private injector: Injector,
    private reportsService: ReportsService
  ) {
    super(injector);

    this.daysAhead = [];
    this.daysAhead.push({label: '30 days', value: 30});
    this.daysAhead.push({label: '60 days', value: 60});
    this.daysAhead.push({label: '90 days', value: 90});
    this.daysAhead.push({label: '6 months', value: 183});
    this.daysAhead.push({label: '1 year', value: 365});
    this.daysAhead.push({label: '18 months', value: 548});

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

  ngOnInit() {
    this.Working();

    this.reportsService.getApproachingEndOfSupport().subscribe(x => {
      this.model = x;
      this.setDaysAhead(this.filterDaysAhead);
      this.Ready();
    });
  }

  filterRows() {
    return this.model.filter(x => x.daysUntilEoS <= parseInt(this.filterDaysAhead, 10));
  }

  setDaysAhead(days) {
    this.filterDaysAhead = days;
    this.rows = this.filterRows();
    this.total = this.rows.reduce((acc, curr) => acc + curr.newEquipmentCost, 0);
  }
}
