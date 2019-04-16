import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Circuit, DeviceInterface, HostItem, ManagedDevice, Vendor } from '../../../models';
import { CircuitService } from './circuit.service';
import { DeviceInterfaceService } from './device-interface.service';
import { DeviceService } from './device.service';
import { DeviceViewModel } from '../view-models';
import { HttpService } from './http.service';
import { VendorService } from './vendor.service';
import { ManagedDeviceService } from './managed-device.service';
import { NotificationService } from './notification.service';
import { NotificationSeverity } from '../models/index';

@Injectable()
export class DeviceViewService extends HttpService {
  constructor(
    private injector: Injector,
    private deviceService: DeviceService,
    private circuitService: CircuitService,
    private vendorService: VendorService,
    private deviceInterfaceService: DeviceInterfaceService,
    private managedDeviceService: ManagedDeviceService,
    private notificationService: NotificationService
  ) {
    super(injector);
  }

  public async getLatestDeviceData(groupId, deviceId) {
    // Prefilters should happen in these.
    // This will work for now but this MUST CHANGE.
    const devices = await this.deviceService.getDevice(deviceId).toPromise() as DeviceViewModel[];
    const device = devices[0];
    const circuits = await this.circuitService.getAllCircuits().toPromise();
    const interfaceMetadata = await this.deviceInterfaceService.getAll().toPromise();
    const vendors: Vendor[] = await this.vendorService.get().toPromise();
    const managedDevices = await this.managedDeviceService.getAll().toPromise();

    this.populateHostItems(device);
    this.populateInterfaceMetadata(device, interfaceMetadata, circuits, vendors);
    this.populateManagementForDevice(device, managedDevices);

    return device;
  }

  public getDevices(groupId): Observable<DeviceViewModel[]> {
    return Observable.fromPromise(this.genDevices(groupId));
  }

  public getCircuits(groupId): Observable<Circuit[]> {
    return Observable.fromPromise(this.genCircuits(groupId));
  }

  public async populateHostItemsForDevice(device: DeviceViewModel, ) {
    device.hostItems = undefined;
    const hostItems = (await this.deviceService.getDevice(device.zabbixHostId).toPromise())[0].hostItems;
    const circuits = await this.circuitService.getAllCircuits().toPromise();
    const interfaceMetadata = await this.deviceInterfaceService.getAll().toPromise();
    const vendors: Vendor[] = await this.vendorService.get().toPromise();
    device.hostItems = hostItems;
    this.populateInterfaceMetadata(device, interfaceMetadata, circuits, vendors);
  }

  private async genViewModel(groupId) {
    const devices: DeviceViewModel[] = await this.deviceService.get().toPromise();
    const circuits = await this.circuitService.getAllCircuits().toPromise();
    const managedDevices: ManagedDevice[] = await this.managedDeviceService.getAll().toPromise();
    const notificationsInAlert = await this.notificationService.getAll(NotificationSeverity.High, -1, '1').toPromise();

    devices.forEach((device) => {
      this.populateManagementForDevice(device, managedDevices);
    });
    devices.forEach((device) => {
      const applicableNotifications = notificationsInAlert.filter(x => x.hostName === device.internalName);
      if (applicableNotifications.length > 0) {
        device.HasActiveNotifications = true;
      } else {
        device.HasActiveNotifications = false;
      }
    });

    return { devices, circuits };
  }

  private async genDevices(groupId) {
    const viewModel = await this.genViewModel(groupId);
    return viewModel.devices;
  }

  private async genCircuits(groupId) {
    const viewModel = await this.genViewModel(groupId);
    return viewModel.circuits;
  }

  private async populateManagementForDevice(device: DeviceViewModel, managedDevices: ManagedDevice[]) {
    const filteredDevices = managedDevices.filter((managed) => managed.host_id.toString() === device.zabbixHostId);
    if (filteredDevices.length > 0) {
      const data = filteredDevices.reverse()[0];
      device.managedDevice = data;
    } else {
      device.managedDevice = new ManagedDevice();
    }
  }

  private populateHostItems(device: DeviceViewModel) {
    device.hostItems = device.hostItems.sort((a, b) => a.name ? a.name.localeCompare(b.name) : -1);
  }

  private populateInterfaceMetadata(device: DeviceViewModel, interfaceMetadata: DeviceInterface[], circuits: Circuit[], vendors: Vendor[]) {
    if (!device.hostItems) {
      return;
    }

    device.hostItems.forEach((item) => {
      item.InterfaceMetadata = interfaceMetadata
        .find((iface) => iface.item_id.toString() === item.itemid
          && iface.host_id.toString() === device.zabbixHostId);
      item.Circuit = circuits
        .find((c: Circuit) => c.host_id.toString() === device.zabbixHostId
          && c.item_id.toString() === item.itemid);

      // To calculate the value score for the circuit, we need to give it access to the monitoring
      // data that was reported with the hostitem.
      if (item.Circuit) {
        item.Circuit.monitoringData = item.monitoringData;
        item.IsCircuit = true;
      } else {
        item.IsCircuit = false;
      }
    });
  }
}
