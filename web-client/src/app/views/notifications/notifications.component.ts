import { ActivatedRoute } from '@angular/router';
import { Component, Injector, OnInit } from '@angular/core';

import { BaseComponent } from '../../containers';
import { NotificationViewModel } from '../../view-models';
import { NotificationService } from '../../services';
import { NotificationSeverity } from '../../models/notification-severity.enum';

@Component({
  templateUrl: 'notifications.component.html',
  styleUrls: [
    'notifications.component.css'
  ]
})
export class NotificationsComponent extends BaseComponent implements OnInit {
  public filtersExist: boolean;

  public filtersEnabled: boolean;

  public severity: number;

  public hasProblem: string;

  public notifications: NotificationViewModel[];

  constructor(
    private injector: Injector,
    private service: NotificationService,
    private route: ActivatedRoute
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.severity = params['severity'] || 0;
      this.hasProblem = params['hasProblem'] || '0,1';
      this.filtersExist = this.severity !== 0 || this.hasProblem !== '0,1';
      this.filtersEnabled = this.filtersExist;

      this.getData();
    });
  }

  public displaySeverity(severity: NotificationSeverity): string {
    return NotificationSeverity[severity];
  }

  public onFilterToggle(): void {
    this.filtersEnabled = !this.filtersEnabled;

    this.getData();
  }

  private getData(): void {
    if (this.filtersEnabled) {
      this.getBySeverity(this.severity, this.hasProblem);
    } else {
      this.getAll();
    }
  }

  private getBySeverity(severity: number = 0, hasProblem: string = '0,1'): void {
    // Because the sub component has it's own loading indicator
    // we will simply use the loading flag on the base component
    // instead of calling Working() and Ready()
    this.isLoading = true;

    this.service.getBySeverity(severity, hasProblem).subscribe((data: NotificationViewModel[]) => {
      this.notifications = data;
      this.isLoading = false;
      this.filtersEnabled = severity !== 0 || hasProblem !== '0,1';
    });
  }

  private getAll(): void {
    this.isLoading = true;

    this.service.getAll().subscribe((data: NotificationViewModel[]) => {
      this.notifications = data;
      this.isLoading = false;
      this.filtersEnabled = false;
    });
  }
}
