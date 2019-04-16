import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { NotificationSeverity } from '../models';
import { HttpService } from './http.service';
import { NotificationViewModel } from '../view-models';
import { StateService } from './state.service';

@Injectable()
export class NotificationService extends HttpService {
  constructor(
    private injector: Injector,
    private state: StateService
  ) {
    super(injector);
  }

  public getBySeverity(severity: NotificationSeverity, values: string = '0,1'
  ): Observable<NotificationViewModel[]> {
    return this.getAll(NotificationSeverity.NotClassified, severity, values);
  }

  // Gets an array of Notification for the specified group ID
  public getAll(
    minimumSeverity: NotificationSeverity = 0,
    severity: NotificationSeverity = -1,
    values: string = '0,1'
  ): Observable<NotificationViewModel[]> {
    const groupId = this.state.User.Account.GroupId;

    let filter = `minimumSeverity=${minimumSeverity}&values=${values}`;
    if (severity !== -1) {
      filter = `severity=${severity}&values=${values}`;
    }

    return super.get(
      `${this.ApiUrls.GetNotifications}/${groupId}?${filter}`)
      .map((data: NotificationViewModel[]) => {
        data.forEach(x => {
          const d = new Date(x.lastChange);

          x.lastChangeDateStamp = x.lastChange
            ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
            : new Date(0).getTime();
        });

        return data;
      });
  }

  // Gets an array of Notification for the specified group ID and host ID
  public getAllForDevice(
    groupId: string,
    deviceId: string,
    minimumSeverity: NotificationSeverity = 0,
    severity: NotificationSeverity = -1,
    values: string = '0,1'
  ): Observable<NotificationViewModel[]> {
    let filter = `minimumSeverity=${minimumSeverity}&values=${values}`;
    if (severity !== -1) {
      filter = `severity=${severity}&values=${values}`;
    }

    return super.get(
      `${this.ApiUrls.GetNotifications}/${groupId}/${deviceId}?${filter}`)
      .map((data: NotificationViewModel[]) => {
        data.forEach(x => {
          const d = new Date(x.lastChange);

          x.lastChangeDateStamp = x.lastChange
            ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
            : new Date(0).getTime();
        });

        return data;
      });
  }
}
