import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../containers/index';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext'

import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AlertViewModel } from '../../../models/index';
import { AlertsService } from '../../../services/alerts.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent extends BaseComponent implements OnInit {

  model: Array<AlertViewModel>;
  selectedAlert: AlertViewModel;
  modalRef: BsModalRef = null;

  constructor(private alertsService: AlertsService,
    private modalService: BsModalService,
    private router: Router,
    injector: Injector) {
    super(injector);
  }

  ngOnInit() {

    this.Working();
    this.loadData();
  }

  loadData() {
    this.alertsService.getAll().subscribe((result) => {
      this.model = result;
      this.Ready();
    })
  }

  public create(template) {
    this.selectedAlert = new AlertViewModel();
    this.modalRef = this.modalService.show(template)
  }

  public edit(selected: AlertViewModel) {
    this.router.navigate(['/alerts/alerts/' + selected.id]);
  }

  public delete(selected: AlertViewModel) {
    this.alertsService.delete(selected.id).subscribe(x => {
      this.model = this.model.filter(y => y.id !== selected.id);
    });
  }

  public async save() {
    this.modalRef.hide();
    this.modalRef = null;
    this.alertsService.save(this.selectedAlert).subscribe(x => {
      this.loadData();
    });

  }

  public cancel() {
    this.modalRef.hide();
    this.modalRef = null;
  }
}
