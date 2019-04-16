import { Component, Injector, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { InvoiceService } from '../../../services/index';
import { WidgetComponent } from '../../../containers';

@Component({
  selector: 'invoice-group-selector',
  templateUrl: './invoice-group-selector.component.html',
  styleUrls: ['./invoice-group-selector.component.scss']
})
export class InvoiceGroupSelectorComponent extends WidgetComponent implements OnInit {

  @Output() onChange = new EventEmitter();

  rows: any[];
  value: string;
  constructor(private invoiceService: InvoiceService, private injector: Injector) {
    super (injector)
   }

  ngOnInit() {
    super.Working();
    this.invoiceService.getGroupsWithPostalCodes().subscribe(x => {
      this.rows = x;
      super.Ready();
    });
  }

  onGroupChange() {
    this.onChange.emit(this.rows.find(x => x.groupId === this.value));
  }
}
