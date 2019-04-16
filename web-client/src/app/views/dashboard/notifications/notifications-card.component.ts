import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationSeverity } from '../../../models';
import { NotificationService } from '../../../services';
import { NotificationViewModel } from '../../../view-models';
import { WidgetComponent } from '../../../containers';

@Component({
  selector: 'notifications-card',
  templateUrl: 'notifications-card.component.html',
  styleUrls: [
    'notifications-card.component.scss'
  ]
})

export class NotificationsCardComponent extends WidgetComponent implements OnInit {
  public scale = 0;
  public warningNotifications = 0;

  public highNotifications = 0;

  public criticalNotifications = 0;

  public isLoading: boolean;

  public direction: string;

  public model: any;

  constructor(
    private injector: Injector,
    private notificationService: NotificationService,
    private router: Router
  ) {
    super(injector);
  }

  public ngOnInit() {
    this.getData();
  }

  private getData(): void {
    const warning = NotificationSeverity[NotificationSeverity.Warning].toLowerCase();
    const high = NotificationSeverity[NotificationSeverity.High].toLowerCase();
    const disaster = NotificationSeverity[NotificationSeverity.Disaster].toLowerCase();

    this.Working();
    // Get only notifications with
    // minimum of high severity in a problem state (value of 1)
    this.notificationService.getAll(NotificationSeverity.Warning, -1, '1')
      .subscribe((data: NotificationViewModel[]) => {
        this.scale = 100 / Math.max(
          data.filter(x => x.severity === warning).length,
          data.filter(x => x.severity === high).length,
          data.filter(x => x.severity === disaster).length
        );

        this.warningNotifications = data
          .filter(x => x.severity === warning).length;

        this.highNotifications = data
          .filter(x => x.severity === high).length;

        this.criticalNotifications = data
          .filter(x => x.severity === disaster).length;

        this.Ready();
      });
  }

  public onWarningClick() {
    this.router.navigate(['/notifications/filter', NotificationSeverity.Warning, 1]);

    return false;
  }

  public onHighClick() {
    this.router.navigate(['/notifications/filter', NotificationSeverity.High, 1]);

    return false;
  }

  public onCriticalClick() {
    this.router.navigate(['/notifications/filter', NotificationSeverity.Disaster, 1]);

    return false;
  }
}
