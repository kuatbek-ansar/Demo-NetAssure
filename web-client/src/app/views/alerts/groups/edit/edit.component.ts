import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../../containers/index';
import { AlertGroupsService } from '../../../../services/alert-groups.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertGroupViewModel, AlertGroupMemberViewModel } from '../../../../models/alert-group.model';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-alert-group-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class GroupEditComponent extends BaseComponent implements OnInit {

  model: AlertGroupViewModel = new AlertGroupViewModel();
  alertGroupId: number;
  selectedRecipient: AlertGroupMemberViewModel;
  modalRef: BsModalRef = null;

  isCreating = false;

  constructor(private alertGroupsService: AlertGroupsService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
    injector: Injector) {
    super(injector);
  }
  ngOnInit() {
    this.route.params.subscribe(res => {
      this.alertGroupId = res.id;
      this.load();
    });
  }

  private load() {
    this.alertGroupsService.getOne(this.alertGroupId).subscribe(x => {
      this.model = x;
      this.model.members = this.model.members || [];
      this.model.members.forEach(y => y.editingId = y.id);
    });
  }

  public create(template: any) {
    this.selectedRecipient = new AlertGroupMemberViewModel();
    // Find the max editingId of existing model members and add 1 for the newly created recipient
    this.selectedRecipient.editingId = Math.max.apply(Math, this.model.members.map((x) => { return x.editingId; })) + 1;

    this.modalRef = this.modalService.show(template);
    this.isCreating = true;
  }

  public edit(template: any, recipient: AlertGroupMemberViewModel) {
    this.isCreating = false;
    this.selectedRecipient = JSON.parse(JSON.stringify(recipient));
    this.modalRef = this.modalService.show(template);
  }

  public delete(selected: AlertGroupMemberViewModel) {
    this.model.members.splice(this.model.members.indexOf(selected), 1);
  }

  public saveModal() {
    if (this.isCreating) {
      this.model.members.push(this.selectedRecipient);
    } else {
      this.model.members.splice(this.model.members.indexOf(this.model.members.find(x => x.editingId === this.selectedRecipient.editingId)),
        1);
      this.model.members.push(this.selectedRecipient);
    }
    this.isCreating = false;
    this.modalRef.hide();
    this.modalRef = null;
  }

  public cancelModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  public save() {
    this.alertGroupsService.save(this.model).subscribe(x => {
      this.router.navigate(['/alerts/groups']);
    });
  }

  public cancel() {
    this.router.navigate(['/alerts/groups']);
  }
}
