import { ActivatedRoute } from '@angular/router';
import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';

import { ToasterConfig, ToasterService } from 'angular2-toaster/angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { BaseComponent } from '../../containers';
import { Graph, HostItem, Vendor } from '../../../../models';
import {
  DeviceViewService,
  VendorService,
  DeviceService,
  GraphService,
  NotificationService,
  FeatureTogglesService
} from '../../services';
import { DeviceViewModel } from '../../view-models';
import { ManagedDeviceService, StateService } from '../../services';
import { ManagedDevice } from '../../../../models';
import { NotificationViewModel } from '../../view-models';
import { digest } from '@angular/compiler/src/i18n/serializers/xmb';
import { MultiEditComponent } from './multi-edit/multi-edit.component';

@Component({
  templateUrl: 'devices.component.html',
  styleUrls: [
    'device.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})

export class DevicesComponent extends BaseComponent implements OnInit {
  devicesAreLoading: boolean;
  chartsAreLoading: boolean;
  notificationsAreLoading: boolean;

  devices: DeviceViewModel[] = [];
  selectedDevice: DeviceViewModel = undefined;
  selectedDeviceGraphs: any[] = [];
  selectedGraph: Graph;
  notifications: NotificationViewModel[];

  notificationsIsActive: boolean;
  notificationsAreLoaded: boolean;
  backupsIsActive: boolean;
  backupsAreLoaded: boolean;
  chartsIsActive: boolean;
  chartsAreLoaded: boolean;
  showSNMP = false;

  // Network Devices Pie Chart
  public networkDevicesPieChartLabels: string[] = ['Up', 'Down'];
  public networkDevicesPieChartData: number[] = [1, 1];
  public networkDevicesPieChartType = 'pie';
  public networkDevicesPieChartColors: any[] = [{ backgroundColor: ['green', 'red'] }];

  constructor(
    private deviceService: DeviceService,
    private deviceViewService: DeviceViewService,
    private graphService: GraphService,
    private injector: Injector,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private managedDeviceService: ManagedDeviceService,
    private stateService: StateService,
    private modalService: BsModalService,
    private featureToggleService: FeatureTogglesService
  ) {
    super(injector);
  }

  async ngOnInit() {
    this.Working();

    this.deviceViewService.getDevices(this.stateService.User.Account.GroupId).subscribe(devices => {
      this.devices = devices;
      this.initializeDevicePageData(this.devices);

      this.Ready();
    });
    this.featureToggleService.toggleIsEnabled('DeviceSNMP').subscribe(x => {
      this.showSNMP = x
    });
  }

  private initializeDevicePageData(devices: DeviceViewModel[]) {
    this.networkDevicesPieChartData = [this.devices.filter(x => !x.HasActiveNotifications).length,
    this.devices.filter(x => x.HasActiveNotifications).length];

    let selectedDeviceId = null;
    this.route.params.subscribe(params => {
      selectedDeviceId = params['id'];
      this.selectedDevice = selectedDeviceId ? devices.find(x => x.zabbixHostId === selectedDeviceId) : devices[0];
      this.changeDevice(this.selectedDevice);
    });

    if (devices.length > 0) {
      this.selectedDevice = selectedDeviceId ? devices.find(x => x.zabbixHostId === selectedDeviceId) : devices[0];
      this.selectedDevice = this.selectedDevice || devices[0];
      this.changeDevice(this.selectedDevice);
    }
  }

  public networkDevicesPieChartClicked(e: any): void {
  }

  public networkDevicesPieChartHovered(e: any): void {
  }

  public async updateCurrentDevice() {
    const updatedDevice = await this.deviceViewService.getLatestDeviceData(this.stateService.User.Account.GroupId,
      this.selectedDevice.zabbixHostId);
    this.changeDevice(updatedDevice);
  }

  public async changeDevice(device: DeviceViewModel) {
    this.devices.forEach(x => {
      x.IsSelected = false;
    });

    device.IsSelected = true;
    this.notificationsAreLoaded = false;
    this.backupsAreLoaded = false;
    this.chartsAreLoaded = false;

    this.selectedDevice = device;
    await this.deviceViewService.populateHostItemsForDevice(device);
    if (this.notificationsIsActive) {
      this.onNotificationsClick();
    }

    if (this.backupsIsActive) {
      this.onBackupsClick();
    }

    if (this.chartsIsActive) {
      this.onChartsClick();
    }
  }

  public editMultipleDevices(selectedDevices: Array<DeviceViewModel>) {
    const modal = this.modalService.show(MultiEditComponent);
    if (!selectedDevices.find(x => !x.managedDevice || !x.managedDevice.isManaged)) {
      modal.content.model.isManaged = true;
    }
    modal.content.onSave = () => {
      for (const device of selectedDevices) {
        if (modal.content.model.isManaged !== device.managedDevice.isManaged) {
          this.onManagedChecked(device);
        }
        if (modal.content.model.latitude) {
          device.geolocation.latitude = modal.content.model.latitude;
        }
        if (modal.content.model.longitude) {
          device.geolocation.longitude = modal.content.model.longitude;
        }
        if (modal.content.model.notes) {
          device.notes = modal.content.model.notes;
        }
        this.deviceService.update(device).subscribe(() => {
          this.showSuccess('Device Updated', device.displayName);
        }, (error: any) => {
          this.showError('Device Update Error', device.displayName);
        });
      }
      // reload
    }
  }

  private showSuccess(heading: string, message: string) {
    this.toasterService.pop('success', heading, message);
  }

  private showError(heading: string, message: string) {
    this.toasterService.pop('error', heading, message);
  }

  // Events
  onSaveClicked() {
    this.deviceService.update(this.selectedDevice).subscribe(() => {
      this.showSuccess('Device Updated', this.selectedDevice.displayName);
    }, (error: any) => {
      this.showError('Device Update Error', this.selectedDevice.displayName);
    });
  }

  onChartClicked(graphIndex) {
    this.selectedGraph = this.selectedDeviceGraphs[graphIndex];
  }

  async onManagedChecked(selectedDevice: DeviceViewModel = null) {
    if (selectedDevice === null) {
      selectedDevice = this.selectedDevice;
    }
    selectedDevice.disableManagementButton = true;
    this.stateService.GetUser();
    const user = this.stateService.User;

    selectedDevice.managedDevice = selectedDevice.managedDevice || new ManagedDevice();
    selectedDevice.managedDevice.host_id = parseInt(selectedDevice.zabbixHostId, 10);
    selectedDevice.managedDevice.group_id = user.HostGroup.Id as any;
    selectedDevice.managedDevice.isManaged = !selectedDevice.managedDevice.isManaged;

    const viewModel = JSON.parse(JSON.stringify(selectedDevice.managedDevice));
    viewModel.name = selectedDevice.internalName;
    if (!selectedDevice.managedDevice.id) {
      this.managedDeviceService.createEntry(viewModel).subscribe(
        () => {
          return;
        },
        () => {
          this.showError('Error Updating Device to Managed.', 'Could not update status as managed device')
        },
        async () => {
          selectedDevice.managedDevice = <ManagedDevice>await
            this.completedManagementSelection(selectedDevice.zabbixHostId, selectedDevice.managedDevice.isManaged);
          selectedDevice.disableManagementButton = false;
        }
      );
    } else {
      this.managedDeviceService.update(viewModel).subscribe(
        () => {
          return;
        },
        () => {
          this.showError('Error Updating Device to Managed.', 'Could not update status as managed device')
        },
        async () => {
          selectedDevice.managedDevice = <ManagedDevice>await
            this.completedManagementSelection(selectedDevice.zabbixHostId, selectedDevice.managedDevice.isManaged);
          selectedDevice.disableManagementButton = false;
        }
      );
    }
  }

  onNotificationsClick() {
    this.backupsIsActive = false;
    this.chartsIsActive = false;

    this.notificationsIsActive = true;

    if (!this.notificationsAreLoaded) {
      this.notificationsAreLoading = true;

      this.notificationService.getAllForDevice(this.selectedDevice.groupIds[0], this.selectedDevice.zabbixHostId)
        .subscribe((data: NotificationViewModel[]) => {
          this.notifications = data;
          this.notificationsAreLoading = false;
          this.notificationsAreLoaded = true;
        });
    }
  }

  onBackupsClick() {
    this.notificationsIsActive = false;
    this.chartsIsActive = false;
    this.backupsIsActive = true;
  }

  onChartsClick() {
    this.notificationsIsActive = false;
    this.backupsIsActive = false;

    this.chartsIsActive = true;

    if (!this.chartsAreLoaded) {
      this.chartsAreLoading = true;

      this.graphService.getHostGraphs(this.selectedDevice)
        .subscribe((graphs) => {
          this.selectedDeviceGraphs = graphs;
          this.chartsAreLoading = false;
          this.chartsAreLoaded = true;
        });

      this.selectedGraph = null;
    }
  }

  private async completedManagementSelection(host_id: string, isManaged: boolean): Promise<ManagedDevice> {
    if (isManaged) {
      this.showSuccess('Device Management Status', `${this.selectedDevice.internalName} now managed.`);
    } else {
      this.showSuccess('Device Management Status', `${this.selectedDevice.internalName} now unmanaged.`);
    }
    // Opportunity for logger/better error handling
    try {
      return await this.managedDeviceService.getManagedDevice(host_id).toPromise() as ManagedDevice;
    } catch (e) {
      console.log(e);
      return new ManagedDevice();
    }
  }
}
