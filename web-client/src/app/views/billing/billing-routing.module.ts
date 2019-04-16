import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceCreationComponent } from './invoice-creation/invoice-creation.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';



const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Invoices'
        },
        children: [
            {
                path: '',
                component: InvoiceListComponent,
                data: { title: null }
            },
            {
                path: 'create',
                component: InvoiceCreationComponent,
                data: {
                    title: 'Create Invoice'
                }
            },
            {
                path: 'view/:id',
                component: InvoiceViewComponent,
                data: {
                    title: 'View Invoice'
                }
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingRoutingModule { }
