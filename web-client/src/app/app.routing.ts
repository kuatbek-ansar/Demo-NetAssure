import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullLayoutComponent } from './containers';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: FullLayoutComponent,
    loadChildren: './views/login/login.module#LoginModule'
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'circuits',
        loadChildren: './views/circuit/circuit.module#CircuitModule'
      },
      {
        path: 'alerts',
        loadChildren: './views/alerts/alerts.module#AlertsModule'
      },
      {
        path: 'reports',
        loadChildren: './views/reports/reports.module#ReportsModule'
      },
      {
        path: 'network-maps',
        loadChildren: './views/network-maps/network-maps.module#NetworkMapsModule'
      },
      {
        path: 'devices',
        loadChildren: './views/devices/devices.module#DevicesModule'
      },
      {
        path: 'notifications',
        loadChildren: './views/notifications/notifications.module#NotificationsModule'
      },
      {
        path: 'vendors',
        loadChildren: './views/vendors/vendors.module#VendorsModule'
      },
      {
        path: 'support-cases',
        loadChildren: './views/support-cases/support-cases.module#SupportCasesModule'
      },
      {
        path: 'settings',
        loadChildren: './views/settings/settings.module#SettingsModule'
      },
      {
        path: 'admin/billing',
        loadChildren: './views/billing/billing.module#BillingModule'
      }
    ],
    canActivate: [
      AuthGuard
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
