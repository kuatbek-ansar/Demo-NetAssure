import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupportCasesComponent } from './support-cases.component';

const routes: Routes = [
  {
    path: '',
    component: SupportCasesComponent,
    data: {
      title: 'Support Cases'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule {
}
