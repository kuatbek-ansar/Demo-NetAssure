import { Component, OnInit, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as _ from 'lodash';

@Component({
  selector: 'multi-chooser',
  templateUrl: './multi-chooser.component.html',
  styleUrls: ['./multi-chooser.component.scss']
})
export class MultiChooserComponent implements OnInit {

  @Input()
  selectedItems;

  @Input()
  allItems;

  get availableItems() {
    return _.sortBy(this.allItems.filter(x => !new Set(this.selectedItems).has(x)), ['name']);
  }

  modalRef: BsModalRef;
  adding;
  deleting;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  showAdd(template) {
    this.modalRef = this.modalService.show(template);
  }

  public cancel() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  public save() {
    this.selectedItems.push(this.allItems.find(x => x.id === parseInt(this.adding, 10)));
    this.modalRef.hide();
    this.modalRef = null;
  }

  public delete() {
    for (const toDelete of this.deleting) {
      this.selectedItems.splice(this.selectedItems.indexOf(this.selectedItems.find(x => x.id === toDelete)), 1);
    }
    this.deleting = [];
  }

}
