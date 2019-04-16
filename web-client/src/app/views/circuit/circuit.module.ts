import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GlobalModule } from '../../global.module';
import {
  DeviceService,
  AlertGroupsService,
  ManagedDeviceService,
  GraphService,
  ProxyService,
} from '../../services';
import { CircuitDetailsComponent } from './details/details.component';
import { CircuitRoutingModule } from './circuit-routing.module';
import { CircuitPredictiveService } from '../../services/circuit-predictive.service';

@NgModule({
  imports: [
    CircuitRoutingModule,
    GlobalModule,
    NgbModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    CircuitDetailsComponent],
  providers: [
    DeviceService,
    ManagedDeviceService,
    AlertGroupsService,
    ProxyService,
    CircuitPredictiveService
  ],
  entryComponents: [
  ]
})
export class CircuitModule {
}
