import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { BackupsComponent } from './backups/backups.component';
import { SnmpComponent } from './snmp/snmp.component';

const routes: Routes = [
  {
    path: 'backups',
    component: BackupsComponent,
    data: {
      title: 'Backup Settings'
    }
  },
{
    path: 'snmp',
    component: SnmpComponent,
    data: {
      title: 'SNMP Settings'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
