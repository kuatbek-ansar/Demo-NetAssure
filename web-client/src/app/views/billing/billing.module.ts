import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GlobalModule } from '../../global.module';
import {
    DeviceService,
    AlertGroupsService,
    ManagedDeviceService,
    GraphService,
    InvoiceService,
    ProxyService,
} from '../../services';
import { BillingRoutingModule } from './billing-routing.module';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceCreationComponent } from './invoice-creation/invoice-creation.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { InvoiceApplianceCostsComponent } from './invoice-appliance-costs/invoice-appliance-costs.component';
import { InvoiceMonitoringCostsComponent } from './invoice-monitoring-costs/invoice-monitoring-costs.component';
import { InvoiceGroupSelectorComponent } from './invoice-group-selector/invoice-group-selector.component';
import { BillableDeviceService } from '../../services/billable-device.service';

@NgModule({
    imports: [
        BillingRoutingModule,
        GlobalModule,
        NgbModule.forRoot(),
        ModalModule.forRoot()
    ],
    declarations: [
        InvoiceListComponent,
        InvoiceCreationComponent,
        InvoiceViewComponent,
        InvoiceApplianceCostsComponent,
        InvoiceMonitoringCostsComponent,
        InvoiceGroupSelectorComponent],
    providers: [
        DeviceService,
        ManagedDeviceService,
        AlertGroupsService,
        InvoiceService,
        ProxyService,
        BillableDeviceService
    ],
    entryComponents: [
    ]
})
export class BillingModule {
}
