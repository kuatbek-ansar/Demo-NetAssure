import { NgModule } from '@angular/core';

import { VendorsComponent } from './vendors.component';
import { VendorsRoutingModule } from './vendors-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GlobalModule } from '../../global.module';
import { VendorService } from '../../services';

@NgModule({
  imports: [
    GlobalModule,
    VendorsRoutingModule,
    ModalModule.forRoot()
  ],
  providers: [
    VendorService
  ],
  declarations: [VendorsComponent]
})
export class VendorsModule {
}
