import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

import { DeviceViewModel } from '../../../view-models';
import { Subject } from 'rxjs/Subject';
import { Table } from 'primeng/table';

@Component({
  selector: 'device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  @Input() devices: DeviceViewModel[];

  @Input() selectedDevice: DeviceViewModel;

  @ViewChild(Table) table: Table;

  @Output() selectDevices: EventEmitter<DeviceViewModel> = new EventEmitter<DeviceViewModel>();
  @Output() editMultiple: EventEmitter<Array<DeviceViewModel>> = new EventEmitter<Array<DeviceViewModel>>();

  public statusFilter: SelectItem[];
  public managedFilter: SelectItem[];
  public debouncingSelect: Subject<DeviceViewModel>;

  public selectedDevices: Array<DeviceViewModel>;

  public managedFilterValue = true;

  constructor(private changeDetector: ChangeDetectorRef) {
    this.statusFilter = [];
    this.statusFilter.push({ label: 'All', value: null });
    this.statusFilter.push({ label: 'Good', value: false });
    this.statusFilter.push({ label: 'Bad', value: true });

    this.managedFilter = [];
    this.managedFilter.push({ label: 'All', value: null });
    this.managedFilter.push({ label: 'Managed', value: true });
    this.managedFilter.push({ label: 'Unmanaged', value: false });

    this.debouncingSelect = new Subject<DeviceViewModel>();
    this.debouncingSelect.debounceTime(300)
      .subscribe(device => {
        this.selectDevices.emit(device);
      });
    this.selectedDevices = [];
  }

  onDeviceRowClicked(event) {
    this.debouncingSelect.next(event.data);
  }

  editMultipleClick() {
    this.editMultiple.emit(this.selectedDevices);
  }

  ngOnInit() {
    if (this.devices && this.devices.filter(x => x.managedDevice.isManaged).length > 0) {
      this.table.filter(true, 'managedDevice.isManaged', 'equals');
    }
    this.selectedDevices.push(this.selectedDevice);
  }
}
