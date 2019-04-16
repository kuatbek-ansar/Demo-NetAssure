import { Component, OnInit, Injector } from '@angular/core';
import { AlertGroupsService } from '../../../services/alert-groups.service';
import { AlertGroupViewModel } from '../../../models/alert-group.model';
import { BaseComponent } from '../../../containers/index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent extends BaseComponent implements OnInit {

  model: Array<AlertGroupViewModel>;
  selectedGroup: AlertGroupViewModel;
  modalRef: BsModalRef = null;

  constructor(private alertGroupsService: AlertGroupsService,
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
    this.alertGroupsService.getAll().subscribe((result) => {
      this.model = result;
      this.Ready();
    })
  }

  public create(template) {
    this.selectedGroup = new AlertGroupViewModel();
    this.modalRef = this.modalService.show(template)
  }

  public edit(selected: AlertGroupViewModel) {
    this.router.navigate(['/alerts/groups/' + selected.id]);
  }

  public delete(selected: AlertGroupViewModel) {
    this.alertGroupsService.delete(selected.id).subscribe(x => {
      this.loadData();
    });
  }

  public async save() {
    this.modalRef.hide();
    this.modalRef = null;
    this.alertGroupsService.save(this.selectedGroup).subscribe(x => {
      this.loadData();
    });

  }

  public cancel() {
    this.modalRef.hide();
    this.modalRef = null;
  }
}
