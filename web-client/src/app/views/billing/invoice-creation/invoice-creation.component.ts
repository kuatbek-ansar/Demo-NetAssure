import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../containers/index';
import { InvoiceService } from '../../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-creation',
  templateUrl: './invoice-creation.component.html',
  styleUrls: ['./invoice-creation.component.scss']
})
export class InvoiceCreationComponent extends BaseComponent implements OnInit {

  groupId = '0';
  date = new Date().toISOString().substr(0, 10);
  applianceTotal = 0;
  monitoringTotal = 0;
  constructor(injector: Injector,
    private invoiceService: InvoiceService,
    private router: Router) {
    super(injector);
  }

  ngOnInit() {
  }

  onGroupChange(event) {
    this.groupId = event.groupId;
  }

  onApplianceTotalUpdate(event) {
    this.applianceTotal = event;
  }
  onMonitoringTotalUpdate(event) {
    this.monitoringTotal = event;
  }

  save() {
    this.invoiceService.saveInvoice(this.groupId, this.date).subscribe( async _ => {
      await this.router.navigate(['/admin/billing']);
    });
  }

}
