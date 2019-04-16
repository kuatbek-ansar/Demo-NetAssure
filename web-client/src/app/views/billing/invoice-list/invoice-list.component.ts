import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../../containers/index';
import { InvoiceService } from '../../../services/index';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent extends BaseComponent implements OnInit {

  unfilteredRowCount: number;
  model: any[];
  groups: any[];
  filterByGroupId;
  isRefreshingGrid: boolean;

  constructor(injector: Injector,
    private invoiceService: InvoiceService,
    private router: Router) {
    super(injector);
    this.model = [];
    this.groups = [{groupId: '', name: 'All'}];
    this.filterByGroupId = '';
    this.isRefreshingGrid = false;
  }

  ngOnInit() {
    this.Working();
    Observable.forkJoin(this.invoiceService.getGroupsWithPostalCodes(), this.invoiceService.getAll())
        .subscribe(([groups, invoices]) => {
          this.groups = this.groups.concat(groups);
          this.model = invoices;
          this.unfilteredRowCount = this.model ? this.model.length : 0;
          this.Ready();
        });
  }

  getGroupName(id: number): string {
    const group = this.groups.find(g => g.groupId === id.toString());
    return group ? group.name : id.toString();
  }

  onGroupChange() {
    this.isRefreshingGrid = true;
    if (!this.filterByGroupId) {
      this.invoiceService.getAll().subscribe(x => {
        this.model = x;
        this.isRefreshingGrid = false;
      });
    } else {
      this.invoiceService.getByGroupId(this.filterByGroupId).subscribe(x => {
        this.model = x;
        this.isRefreshingGrid = false;
      });
    }
  }

  view(item) {
    this.router.navigate(['/admin/billing/view', item.id]);
  }

  download(item) {
    this.invoiceService.download(item.id.toString()).subscribe(data => saveAs(data, `Invoice.pdf`));
  }

  create() {
    this.router.navigate(['/admin/billing/create']);
  }
}
