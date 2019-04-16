import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/primeng';

import { ReportTypes } from './report-types.enum';
import { BaseComponent } from '../../containers/base-component';

@Component({
  templateUrl: 'reports.component.html',
  styleUrls: [
    'reports.component.scss'
  ]
})
export class ReportsComponent extends BaseComponent implements OnInit {
  public reports: SelectItem[] = [];

  public report: ReportTypes = ReportTypes.Top10UtilizedCircuits;

  public reportTypes = ReportTypes;

  public onChangeReport(event) {
    const reportUriName = Object.keys(ReportTypes).find( key => ReportTypes[key] === this.report)
    const reportPath = `/reports/${reportUriName}`;
    this.router.navigate([reportPath]);
  }

  public constructor(
    private injector: Injector,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(injector);
    Object.keys(ReportTypes).forEach(x => {
      this.reports.push({value: x, label: ReportTypes[x]});
    });
  }

  public ngOnInit(): void {
    this.Ready();
    this.route.params.subscribe(params => {
      this.report = (<any>ReportTypes)[params['selectedReport']] || ReportTypes.Top10UtilizedCircuits;
    });
  }
}
