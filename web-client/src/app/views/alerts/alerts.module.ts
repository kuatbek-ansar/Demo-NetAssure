import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GlobalModule } from '../../global.module';
import { TextMaskModule } from 'angular2-text-mask';
import { AlertsComponent,
    GroupsComponent,
    GroupEditComponent,
    AlertsRoutingModule,
    AlertEditComponent
 } from './';
import { MultiChooserComponent } from '../../controls';
import {
    DeviceService,
    NotificationService,
    ReportsService,
    NotificationTypeService,
    AlertGroupsService,
    ManagedDeviceService,
    BackupService,
    DeviceViewService,
    DeviceInterfaceService,
    VendorService,
    CircuitService,
    GraphService,
    HistoryService,
    AlertsService
} from '../../services';

@NgModule({
    imports: [
        AlertsRoutingModule,
        GlobalModule,
        NgbModule.forRoot(),
        ModalModule.forRoot(),
        TextMaskModule,
    ],
    declarations: [
        AlertsComponent,
        GroupsComponent,
        GroupEditComponent,
        AlertEditComponent,
        MultiChooserComponent
    ],
    providers: [
        DeviceService,
        NotificationService,
        ManagedDeviceService,
        AlertGroupsService,
        AlertsService,
        DeviceViewService,
        CircuitService,
        VendorService,
        DeviceInterfaceService,
        NotificationTypeService
    ],
    entryComponents: [
    ]
})
export class AlertsModule {
}
