import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { MultiEditModel } from './mutli-edit.model';

@Component({
  selector: 'multi-edit',
  templateUrl: './multi-edit.component.html',
  styleUrls: ['./multi-edit.component.scss']
})
export class MultiEditComponent implements OnInit {

  public model;
  public onSave: Function;
  constructor(public bsModalRef: BsModalRef) {
    this.model = new MultiEditModel();
   }

  close() {
    this.bsModalRef.hide();
  }
  save() {
    this.bsModalRef.hide();
    this.onSave();
  }
  ngOnInit() {
  }

}
