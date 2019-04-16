import { NgModule } from '@angular/core';

import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { GlobalModule } from '../../global.module';
import { Top10UtilizedCircuitsComponent } from './top10-utilized-circuits/top10-utilized-circuits.component';
import { Top10UtilizedInterfacesComponent } from './top10-utilized-interfaces/top10-utilized-interfaces.component';
import { ReportsService } from '../../services';
import { Bottom10UtilizedCircuitsComponent } from './bottom10-utilized-circuits/bottom10-utilized-circuits.component';
import { Bottom10UtilizedInterfacesComponent } from './bottom10-utilized-interfaces/bottom10-utilized-interfaces.component';
import { EndOfSupportComponent } from './end-of-support/end-of-support.component';
import { ManagedDevicesComponent } from './managed-devices/managed-devices.component';
import { ManagedDevicesHistoryComponent } from './managed-devices-history/managed-devices-history.component';
import { ApproachingEndOfSupportComponent } from './approaching-end-of-support/approaching-end-of-support.component';
import { CircuitValueScoresComponent } from './circuit-value-scores/circuit-value-scores.component';
import { SlaViolationsComponent } from './sla-violations/sla-violations.component';
@NgModule({
  imports: [
    GlobalModule,
    ReportsRoutingModule,
  ],
  declarations: [
    ReportsComponent,
    Top10UtilizedCircuitsComponent,
    Top10UtilizedInterfacesComponent,
    Bottom10UtilizedCircuitsComponent,
    Bottom10UtilizedInterfacesComponent,
    ManagedDevicesComponent,
    ManagedDevicesHistoryComponent,
    EndOfSupportComponent,
    ApproachingEndOfSupportComponent,
    CircuitValueScoresComponent,
    SlaViolationsComponent,
  ],
  providers: [ReportsService]
})
export class ReportsModule {
}
