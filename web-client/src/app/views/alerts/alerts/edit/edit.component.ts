import { Component, OnInit, Injector } from '@angular/core';
import { AlertViewModel, AlertGroupViewModel } from '../../../../models/index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BaseComponent } from '../../../../containers/index';
import { AlertsService } from '../../../../services/alerts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import {
  ManagedDeviceService,
  DeviceService,
  NotificationTypeService,
  DeviceViewService,
  StateService,
  AlertGroupsService
} from '../../../../services/index';
import { ManagedDevice } from '../../../../../../models/index';
import { forEach } from '@angular/router/src/utils/collection';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-alert-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})

export class AlertEditComponent extends BaseComponent implements OnInit {

  model: AlertViewModel = new AlertViewModel();
  alertId: number;
  selectedRecipient: AlertViewModel;
  modalRef: BsModalRef = null;

  allDevices: Array<any>;
  allAlertGroups: Array<AlertGroupViewModel>;
  allNotifications: Array<any>;

  isCreating = false;

  constructor(private alertsService: AlertsService,
    private deviceViewService: DeviceViewService,
    private notificationTypesService: NotificationTypeService,
    private alertGroupsService: AlertGroupsService,
    private stateService: StateService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    injector: Injector) {
    super(injector);
  }
  ngOnInit() {
    this.Working();
    this.route.params.subscribe(res => {
      this.alertId =  res.id;
      this.load();
    });
  }

  private load() {

    const devicesObservable = this.deviceViewService.getDevices(this.stateService.User.Account.GroupId);
    const alertGroupsObservable = this.alertGroupsService.getAll();
    const alertsObservable = this.alertsService.getOne(this.alertId);
    const notificationObservable = this.notificationTypesService.getAll();

    Observable.zip(devicesObservable, alertGroupsObservable, alertsObservable, notificationObservable)
      .subscribe(([devices, alertGroups, alert, notifications]) => {
        this.allDevices = devices.filter(y => y.managedDevice.isManaged).map(y => ({ name: y.displayName, id: y.managedDevice.id }));

        this.allAlertGroups = alertGroups;

        this.allNotifications = notifications;

        this.model = alert;
        this.model.alertGroups = this.model.alertGroups || [];
        this.model.alertGroups = this.model.alertGroups.map(alertGroup => this.allAlertGroups.find(x => x.id === alertGroup.id));

        this.model.managedDevices = this.model.managedDevices || [];
        this.model.managedDevices = this.model.managedDevices.map(device => this.allDevices.find(x => x.id === device.id));

        this.model.notifications = this.model.notifications || [];
        this.model.notifications = this.model.notifications.map(notification => this.allNotifications.find(x => x.id === notification.id));

        this.Ready();
      });
  }

  public save() {
    this.alertsService.save(this.model).subscribe(x => {
      this.router.navigate(['/alerts/alerts']);
    });
  }

  public cancel() {
    this.router.navigate(['/alerts/alerts']);
  }
}
