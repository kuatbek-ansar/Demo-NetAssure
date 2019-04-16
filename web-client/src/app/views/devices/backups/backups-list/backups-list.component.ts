import { Component, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as JSDiff from 'diff';
import * as Moment from 'moment';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs/Observable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

const moment = Moment;

import { AwsVersionedFileViewModel } from '../../../../view-models';
import { BackupService } from '../../../../services';

@Component({
  selector: 'backups-list',
  templateUrl: 'backups-list.component.html',
  styleUrls: [
    'backups-list.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class BackupsListComponent implements OnChanges {
  // tslint:disable-next-line:no-input-rename
  @Input('Data') backups: AwsVersionedFileViewModel[];

  @Input() isLoading: boolean;

  @ViewChild(Table) table: Table;

  public dateFilter: Date;

  public dateFilterDisabledDates: Date[];

  public minDate: Date;

  public maxDate: Date;

  public sourceFile: string;
  public destinationFile: string;

  public parts: DiffPart[];
  private dialogRef: BsModalRef;

  constructor(private backupService: BackupService,
              private modalService: BsModalService) {
    this.dateFilterDisabledDates = [];
  }

  public ngOnChanges() {
    if (!this.backups) {
      return;
    }

    this.dateFilter = null;

    const minDate = new Date(this.backups
      .reduce((x, y) => y.lastModified < x.lastModified ? y : x).lastModified);
    this.minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());

    const maxDate = new Date(this.backups.reduce((x, y) =>
      x.lastModified > y.lastModified ? x : y).lastModified);
    this.maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());

    const dates = this.backups
      .map(x => {
        const d = new Date(x.lastModified);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      })
      .filter((date, i, array) => array.indexOf(date) === i)
      .sort();

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1);

    for (const d = this.minDate; d < nextMonth; d.setDate(d.getDate() + 1)) {
      if (dates.indexOf(new Date(d).getTime()) === -1) {
        this.dateFilterDisabledDates.push(new Date(d));
      }
    }
  }

  public onDateFilter(value: any, field: any, matchMode: any) {
    const v = new Date(value).getTime();

    this.table.filter(v, field, matchMode);
  }

  public download(item: AwsVersionedFileViewModel) {
    const path = this.getPath(item.url);

    this.backupService.downloadBackup(encodeURIComponent(path), item.versionId).subscribe(x => {
      window.location.href = x.url;
    })
  }

  public compare(diffModal) {
    const sourceObservable = this.backupService.getDownloadText(this.getPath(this.backups[0].url), this.sourceFile);
    const destinationObservable = this.backupService.getDownloadText(this.getPath(this.backups[0].url), this.destinationFile);

    Observable.zip(sourceObservable, destinationObservable).subscribe(([source, destination]) => {
      this.parts = JSDiff.diffLines(source, destination)
      this.dialogRef = this.modalService.show(diffModal, { class: 'modal-lg' });
    });
  }

  public closeDiff() {
    this.dialogRef.hide();
  }

  private getPath(url: string): string {
    const segements = url.split('/');

    return `${segements[segements.length - 2]}/${segements[segements.length - 1]}`;
  }
}

class DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}
