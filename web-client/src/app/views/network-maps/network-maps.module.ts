import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal/modal.module';

import { GlobalModule } from '../../global.module';
import { NetworkMapsComponent } from './network-maps.component';
import { NetworkMapsRoutingModule } from './network-maps-routing.module';
import { NetworkMapService } from '../../services';
import { LaddaModule } from 'angular2-ladda';

@NgModule({
  imports: [
    GlobalModule,
    ModalModule.forRoot(),
    NetworkMapsRoutingModule,
    LaddaModule
  ],
  declarations: [
    NetworkMapsComponent
  ],
  providers: [
    NetworkMapService
  ]
})
export class NetworkMapsModule {
}
