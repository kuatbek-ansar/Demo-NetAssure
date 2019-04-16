import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import { CircuitDetailsComponent } from './details/details.component';




const routes: Routes = [
  {
    path: ':id',
    component: CircuitDetailsComponent,
    data: {
      title: 'Circuit'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CircuitRoutingModule { }
