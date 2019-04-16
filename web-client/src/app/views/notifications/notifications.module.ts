import { NgModule } from '@angular/core';

import { GlobalModule } from '../../global.module';
import { NotificationsComponent } from './notifications.component';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationService } from '../../services';

@NgModule({
  imports: [
    GlobalModule,
    NotificationsRoutingModule
  ],
  declarations: [
    NotificationsComponent
  ],
  providers: [
    NotificationService
  ]
})
export class NotificationsModule {
}
