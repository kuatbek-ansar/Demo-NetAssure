import { NgModule } from '@angular/core';

import { GlobalModule } from '../../global.module';

import { SupportCasesComponent } from './support-cases.component';
import { SupportRoutingModule } from './support-cases-routing.module';
import { SupportCasesService } from '../../services';

@NgModule({
  imports: [
    GlobalModule,
    SupportRoutingModule
  ],
  declarations: [
    SupportCasesComponent
  ],
  providers: [
    SupportCasesService
  ]
})
export class SupportCasesModule { }
