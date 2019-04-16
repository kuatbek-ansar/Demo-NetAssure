import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { FileUpload } from '../../models';

@Component({
  selector: 'app-file-upload',
  templateUrl: 'app-file-upload.component.html',
  styleUrls: [
    'app-file-upload.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})

export class AppFileUploadComponent implements OnInit {
  @Input() Model: FileUpload;
  @Output() onComplete: EventEmitter<string>;

  public constructor() {
    this.onComplete = new EventEmitter<string>();
  }

  public ngOnInit(): void {
    this.Model.onUploadComplete = this.onComplete;
  }

  public Reset(): void {
    this.Model.Reset();
  }

  public onDelete(confirmed: boolean) {
    if (!confirmed) {
      setTimeout(() => {
        this.Model.ConfirmDelete = !this.Model.ConfirmDelete;
      }, 2000);

      return;
    }

    // Delete
    this.Model.Reset();
  }
}
