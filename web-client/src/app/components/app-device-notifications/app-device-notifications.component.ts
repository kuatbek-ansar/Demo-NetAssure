import { Component, Injector, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';

import * as Moment from 'moment';
import { SelectItem } from 'primeng/primeng';
import { Table } from 'primeng/table';

import { NotificationViewModel } from '../../view-models';
import { NotificationStatusFilter, NotificationSeverityFilter } from '../../models';
import { WidgetComponent } from '../../containers';


const moment = Moment;

@Component({
  selector: 'app-device-notifications',
  templateUrl: 'app-device-notifications.component.html',
  styleUrls: [
    'app-device-notifications.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class DeviceNotificationsComponent extends WidgetComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() isLoading: boolean;

  @Input() notifications: NotificationViewModel[];

  @ViewChild(Table) table: Table;

  public statusFilterValue = 'true';

  public statusFilter: SelectItem[] = [];

  public severetyFilter: SelectItem[] = [];

  public dateFilter: Date;

  public dateFilterDisabledDates: Date[];

  public minDate: Date;

  public maxDate: Date;

  public notificationsProgress: any[];

  public chartData: number[] = [1, 1];

  constructor(
    private injector: Injector
  ) {
    super(injector);

    Object.keys(NotificationStatusFilter).forEach(x => {
      this.statusFilter.push({label: x, value: NotificationStatusFilter[x]});
    });

    Object.keys(NotificationSeverityFilter).forEach(x => {
      this.severetyFilter.push({label: x, value: NotificationSeverityFilter[x]});
    });
  }

  public ngAfterViewInit() {
    this.onProblemFilter(true, 'hasProblem', 'equals');
  }

  public ngOnInit() {

  }

  public ngOnChanges() {
    if (!this.notifications || this.notifications.length === 0) {
      return;
    }

    this.getData();
  }

  public getData() {
    this.dateFilterDisabledDates = [];
    this.dateFilter = null;
    this.notificationsProgress = [];

    const now = new Date();
    let minDate = now;
    let maxDate = now;

    const passing = this.notifications.filter(x => !x.hasProblem).length;
    const failing = this.notifications.filter(x => x.hasProblem).length;

    this.notificationsProgress.push({
      value: (passing / this.notifications.length) * 100,
      type: 'success',
      label: `Passed: ${passing} (${Math.round((passing / this.notifications.length) * 100)}%)`
    });
    this.notificationsProgress.push({
      value: (failing / this.notifications.length) * 100,
      type: 'danger',
      label: `Failed: ${failing} (${Math.round((failing / this.notifications.length) * 100)}%)`
    });

    this.chartData = [passing, failing];

    // Get all dates after new Date(0)
    const notificationsWithDates = this.notifications
      .filter(x => moment(x.lastChange).isAfter(new Date(0)));

    if (notificationsWithDates.length > 0) {
      // Find the earliest date in the notifications
      minDate = new Date(
        notificationsWithDates.reduce((x, y) => y.lastChange < x.lastChange ? y : x).lastChange
      );

      // Find the latest date in the notifications
      maxDate = new Date(
        notificationsWithDates
          .reduce((x, y) => x.lastChange > y.lastChange ? x : y).lastChange
      );
    }
    this.minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    this.maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());

    // Get a list of unique dates from the notifications
    const dates = notificationsWithDates
      .map(x => {
        const d = new Date(x.lastChange);

        // Convert the last change date to date only
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      })
      // Filter out duplicate dates
      .filter((date, i, array) => array.indexOf(date) === i)
      .sort();

    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1);
    for (const d = this.minDate; d < nextMonth; d.setDate(d.getDate() + 1)) {
      if (dates.indexOf(new Date(d).getTime()) === -1) {
        this.dateFilterDisabledDates.push(new Date(d));
      }
    }
  }

  public formatDate(value: Date) {
    const v = new Date(value);

    return moment(value).isAfter(new Date(0)) ? `${v.toLocaleDateString()} @ ${v.toLocaleTimeString()}` : '';
  }

  public onDateFilter(value: any, field: any, matchMode: any) {
    const v = new Date(value).getTime();

    this.table.filter(v, field, matchMode);
  }

  public onProblemFilter(value: any, field: any, matchMode: any) {
    this.table.filter(value, field, matchMode);
  }
}
