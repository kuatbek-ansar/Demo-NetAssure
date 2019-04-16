import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorsComponent } from './vendors.component';

const routes: Routes = [
  {
    path: '',
    component: VendorsComponent,
    data: {
      title: 'Vendors'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsRoutingModule {
}
