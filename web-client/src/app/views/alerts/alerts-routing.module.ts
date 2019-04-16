import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { AlertsComponent } from './alerts/alerts.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupEditComponent } from './groups/edit/edit.component';
import { AlertEditComponent } from './alerts/edit/edit.component';

const routes: Routes = [
  {
    path: 'alerts',
    component: AlertsComponent,
    data: {
      title: 'Alerts'
    }
  },
  {
    path: 'alerts/:id',
    component: AlertEditComponent,
    data: {
      title: 'Edit Alert'
    }
  },
  {
    path: 'groups',
    component: GroupsComponent,
    data: {
      title: 'Alert Groups'
    },
  },
  {
    path: 'groups/:id',
    component: GroupEditComponent,
    data: {
      title: 'Edit Alert Group'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertsRoutingModule { }
