import { DevicesRoutingModule } from './devices-routing.module';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TextMaskModule } from 'angular2-text-mask';

import {
  BackupService,
  CircuitService,
  DeviceInterfaceService,
  DeviceService,
  DeviceViewService,
  GraphService,
  HistoryService,
  ManagedDeviceService,
  NotificationService,
  ReportsService,
  SNMPConfigService,
  VendorService
} from '../../services';

import { GlobalModule } from '../../global.module';
import { BackupsComponent } from './backups/backups.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { DevicesComponent } from './devices.component';
import { InterfaceListComponent } from './interface-list/interface-list.component';
import { MultiEditComponent } from './multi-edit/multi-edit.component';
import { SnmpComponent } from './snmp/snmp.component';
import { StringCleanPipe } from '../../pipes/string-clean-pipe';
import { VendorNgModalComponent } from './modal/vendor-modal/vendor-modal.component';
import { BackupsListComponent } from './backups/backups-list';
import { TimeAgoPipe } from '../../pipes/time-ago-pipe';

@NgModule({
  imports: [
    DevicesRoutingModule,
    GlobalModule,
    ModalModule.forRoot(),
    NgbModule.forRoot(),
    TextMaskModule,
  ],
  declarations: [
    BackupsComponent,
    DeviceListComponent,
    DevicesComponent,
    InterfaceListComponent,
    MultiEditComponent,
    SnmpComponent,
    StringCleanPipe,
    TimeAgoPipe,
    VendorNgModalComponent,
    BackupsListComponent
  ],
  providers: [
    BackupService,
    CircuitService,
    DeviceInterfaceService,
    DeviceService,
    DeviceViewService,
    GraphService,
    HistoryService,
    ManagedDeviceService,
    NotificationService,
    ReportsService,
    SNMPConfigService,
    VendorService,
  ],
  entryComponents: [
    MultiEditComponent,
    VendorNgModalComponent
  ]
})
export class DevicesModule {
}
