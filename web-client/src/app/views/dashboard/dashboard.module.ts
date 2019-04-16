import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ManagedDevicesCountComponent } from './managed-devices-count/managed-devices-count.component';
import { SlaViolationsComponent } from './sla-violations/sla-violations.component';
import { NumberCardComponent } from './number-card/number-card.component';
import { GlobalModule } from '../../global.module';
import { ValueScoreComponent } from './value-score/value-score.component';
import { DeviceService, DeviceInterfaceService, DeviceViewService, ManagedDeviceService,
  NotificationService, CircuitService, VendorService, ReportsService, ReleaseNotesService } from '../../services';
import { NotificationsCardComponent } from './notifications/notifications-card.component';
import { CircuitCountComponent } from './circuit-count/circuit-count.component';
import { Layer7Component } from './layer7/layer7.component';
import { TopTalkersComponent } from './top-talkers/top-talkers.component';
import { ReleaseNotesComponent } from './release-notes/release-notes.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    ChartsModule,
    GlobalModule
  ],
  declarations: [
    DashboardComponent,
    ManagedDevicesCountComponent,
    SlaViolationsComponent,
    NumberCardComponent,
    ValueScoreComponent,
    NotificationsCardComponent,
    CircuitCountComponent,
    Layer7Component,
    TopTalkersComponent,
    ReleaseNotesComponent
  ],
  providers: [
    ManagedDeviceService,
    NotificationService,
    ReportsService,
    CircuitService,
    DeviceService,
    DeviceViewService,
    ReleaseNotesService,
    VendorService,
    DeviceInterfaceService,
  ]
})
export class DashboardModule {
}
