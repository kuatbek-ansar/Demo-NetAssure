import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Circuit, HostItem, Vendor } from '../../../../../models/index';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CircuitService } from '../../../services/index';
import { DeviceViewModel } from '../../../view-models/index';
import { StateService } from '../../../services/state.service';
import { ToasterService } from 'angular2-toaster';
import { VendorService } from '../../../services/vendor.service';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'interface-list',
  templateUrl: './interface-list.component.html',
  styleUrls: ['./interface-list.component.scss']
})
export class InterfaceListComponent implements OnInit {

  @Input() selectedDevice: DeviceViewModel;
  @Output() updateDevice: EventEmitter<any> = new EventEmitter<any>();

  public circuitFilter: SelectItem[];
  selectedCircuitInterface: HostItem;
  curcuitBeingEdited: boolean;
  circuitModalRef: BsModalRef = null;
  circuitDeleteModalRef: BsModalRef = null;
  vendors: Vendor[] = [];

  public ipAddressMask = ((input, state) => {
    const currentCaretPosition = state.currentCaretPosition;
    const digitRegexp = /\d/;
    const dotOrDigitRegexp = /[\d\.]/;
    const dotRegexp = /\./;

    const symbols = {
      '.': '.',
      '=': dotOrDigitRegexp,
      '_': digitRegexp,
    }

    input = input.replace(/_*/, '');
    input = input.replace(/\.\.*$/, '.');

    const format = '_==._==._==.___';
    const out = [];
    let i = 0, j = 0;
    for (; i < input.length && j < format.length; ++i, ++j) {
      const inChar = input[i];

      if (inChar === '.') {
        while (j < format.length && format[j] === '=') {
          ++j;
        }
      }
      out.push(format[j]);
    }

    out.push(format.substring(j));

    return out.join('').split('')
      .map(c => symbols[c] || digitRegexp);
  });

  constructor(private circuitService: CircuitService,
    private stateService: StateService,
    private toasterService: ToasterService,
    private vendorService: VendorService,
    private modalService: BsModalService) {
    this.circuitFilter = [];
    this.circuitFilter.push({ label: 'All', value: null });
    this.circuitFilter.push({ label: 'Yes', value: true });
    this.circuitFilter.push({ label: 'No', value: false });
  }

  ngOnInit() {
    this.vendorService.get().subscribe((v: Vendor[]) => this.vendors = v);
  }

  public openCircuitEditModal(deviceItem: HostItem, template: any, editing: boolean = false) {
    // Deep copy the object to avoid auto-changes
    this.selectedCircuitInterface = JSON.parse(JSON.stringify(deviceItem));
    this.curcuitBeingEdited = editing;
    this.circuitModalRef = this.modalService.show(template)
  }

  public openCircuitDeleteModal(deviceItem: HostItem, template: any) {
    this.selectedCircuitInterface = deviceItem;
    this.circuitDeleteModalRef = this.modalService.show(template);
  }

  public closeCircuitEditModal(deviceItem: HostItem) {
    if (!this.curcuitBeingEdited) {
      const editedItem = this.selectedDevice.hostItems.find(x => x.itemid === this.selectedCircuitInterface.itemid);
      editedItem.Circuit = undefined;
      editedItem.IsCircuit = false;
    }

    this.circuitModalRef.hide();
    this.circuitModalRef = null;
  }

  public closeCircuitDeleteModal(deviceItem: HostItem, cancelled = false) {
    if (cancelled) {
      deviceItem.IsCircuit = true;
    }
    this.selectedCircuitInterface = null;
    this.circuitDeleteModalRef.hide();
    this.circuitDeleteModalRef = null;
  }

  public async onCircuitChangeClick(deviceItem: HostItem, editTemplate: any, deleteTemplate: any) {
    deviceItem.IsCircuit = !deviceItem.IsCircuit;

    if (deviceItem.IsCircuit) { // checkbox ticked
      deviceItem.Circuit = new Circuit({
        item_id: Number(deviceItem.itemid),
        host_id: Number(this.selectedDevice.zabbixHostId),
        owner_account_id: 0,
        monitoringData: deviceItem.monitoringData
      });
      this.openCircuitEditModal(deviceItem, editTemplate);
    } else { // checkbox unticked
      this.openCircuitDeleteModal(deviceItem, deleteTemplate);
    }
  }

  public async saveCircuitEditModal(deviceItem: HostItem) {
    try {
      const user = this.stateService.User;
      if (deviceItem.Circuit.remote_ip) {
        deviceItem.Circuit.remote_ip = deviceItem.Circuit.remote_ip.replace(/_/g, '');
      }
      deviceItem.Circuit = await this.circuitService.addCircuit(deviceItem.Circuit).toPromise();
      this.selectedDevice.hostItems = null; // force the app-widget-loading
      this.updateDevice.emit(null);
      this.showSuccess('Saving Circuit...', 'Circuit Saved!');
    } catch (e) {
      if (e.status >= 200 && e.status <= 299) {
        const user = this.stateService.User;
        this.selectedDevice.hostItems = null; // force the app-widget-loading
        this.updateDevice.emit(null);
        this.showSuccess('Saving Circuit...', 'Circuit Saved!');
      } else {
        this.showError('Saving Circuit...', 'Could not save.');
        throw new Error(e);
      }
    }
    this.circuitModalRef.hide();
    this.circuitModalRef = null;
  }

  public async deleteCircuit(deviceItem: HostItem) {
    // if no circuit exists from the db, keep the circuit object null.
    // since we make a fake circuit in anticipation of a user completing it, we may need to remove it when they dont want it
    if (deviceItem.Circuit && !deviceItem.Circuit.circuit_id) {
      deviceItem.Circuit = null;
      return;
    }

    try {
      await this.circuitService.deleteCircuit(deviceItem.Circuit).toPromise();
      this.selectedDevice.hostItems = null; // force the app-widget-loading
      this.updateDevice.emit();
      this.showSuccess('Removing Circuit...', 'Circuit Removed!');
      this.closeCircuitDeleteModal(deviceItem, false);
    } catch (e) {
      if (e.status >= 200 && e.status <= 299) {
        const user = this.stateService.User;
        this.selectedDevice.hostItems = null; // force the app-widget-loading
        this.updateDevice.emit();
        this.showSuccess('Removing Circuit...', 'Circuit Removed!');
      } else {
        this.showError('Removing Circuit....', 'Could not remove.');
        throw new Error(e);
      }
    }
  }

  public hasSLA(circuit: Circuit): string {
    if (!circuit) {
      return;
    }

    return [
      'sla_availability', 'sla_throughput_send', 'sla_throughput_receive',
      'sla_jitter', 'sla_packet_loss', 'sla_latency'
    ].reduce((res, item) => res || !!(circuit[item]), false) ? 'Yes' : 'No';
  }

  private showSuccess(heading: string, message: string) {
    this.toasterService.pop('success', heading, message);
  }

  private showError(heading: string, message: string) {
    this.toasterService.pop('error', heading, message);
  }

  compareVendors(c1: Vendor, c2: Vendor): boolean {
    return c1 && c2 ? c1.id.toString() === c2.id.toString() : c1 === c2;
  }
}
