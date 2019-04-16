import { Component, OnInit, Input, Injector, EventEmitter, Output } from '@angular/core';
import { WidgetComponent } from '../../../containers';
import { BillableDeviceService } from '../../../services/billable-device.service';
import { ManagedDeviceCost } from '../../../../../models';


@Component({
  selector: 'invoice-monitoring-costs',
  templateUrl: './invoice-monitoring-costs.component.html',
  styleUrls: ['./invoice-monitoring-costs.component.scss']
})
export class InvoiceMonitoringCostsComponent extends WidgetComponent implements OnInit {

  @Input()
  set groupId(value: string) {
    this._groupId = value;
    this.refresh();
  }
  _groupId: string;

  @Input()
  set date(value: string) {
    this._date = value;
    this.refresh();
  }
  _date: string;

  @Output()
  totalUpdated = new EventEmitter();

  model: Array<ManagedDeviceCost>;
  total: number;

  constructor(injector: Injector, private billableDeviceService: BillableDeviceService) {
    super(injector);
  }

  ngOnInit() {
  }

  refresh() {
    if (this._date && this._groupId) {
      this.Working();
      this.billableDeviceService.getBillableDevices(this._groupId, this._date).subscribe(x => {
        this.model = x;
        this.total = this.model.reduce((current, device) => current + device.cost, 0);
        this.totalUpdated.emit(this.total);
        this.Ready();
      });
    }
  }

}
