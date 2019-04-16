import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { NetworkMapsComponent } from './network-maps.component';

const routes: Routes = [
  {
    path: '',
    component: NetworkMapsComponent,
    data: {
      title: 'Network Maps'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkMapsRoutingModule {}
