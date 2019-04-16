import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../containers/index';
import { InvoiceService } from '../../../services/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent extends BaseComponent implements OnInit {

  model;
  constructor(injector: Injector,
    private invoiceService: InvoiceService,
    private router: Router,
    private activateRoute: ActivatedRoute) {
    super(injector);
  }

  ngOnInit() {
    this.Working();
    this.activateRoute.params.subscribe(params => {
      const id = params['id'];
      this.invoiceService.getInvoice(id).subscribe(x => {
        this.model = x;
        this.Ready();
      });
    });
  }

  total() {
    if (this.model && this.model.lineItems) {
      return this.model.lineItems.map(x => x.price * x.quantity).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }
    return 0;
  }

}
