import { Component, OnInit, Injector, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { WidgetComponent } from '../../../containers';
import { ProxyService } from '../../../services';
import { ProxyCost } from '../../../../../models';

@Component({
  selector: 'invoice-appliance-costs',
  templateUrl: './invoice-appliance-costs.component.html',
  styleUrls: ['./invoice-appliance-costs.component.scss']
})
export class InvoiceApplianceCostsComponent extends WidgetComponent implements OnInit {

  @Input()
  set groupId(value: string) {
    this._groupId = value;
    this.refresh();
  }
  _groupId: string;

  @Output()
  totalUpdated = new EventEmitter();

  total: number;
  model: Array<ProxyCost>;

  constructor(injector: Injector, private proxyService: ProxyService) {
    super(injector);
  }

  ngOnInit() {

  }

  refresh() {
    this.Working();
    this.proxyService.getCurrentProxiesForGroup(this._groupId).subscribe(x => {
      this.model = x;
      this.total = this.model.reduce((current, proxy) => current + proxy.cost, 0);
      this.totalUpdated.emit(this.total);
      this.Ready();
    });
  }

}
