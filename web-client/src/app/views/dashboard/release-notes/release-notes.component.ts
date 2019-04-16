import { Component, OnInit, Injector } from '@angular/core';
import { WidgetComponent } from '../../../containers';
import { ReleaseNotesService } from '../../../services';
import { ReleaseNote } from '../../../../../models';
import * as _ from 'lodash';

@Component({
  selector: 'release-notes',
  templateUrl: './release-notes.component.html',
  styleUrls: ['./release-notes.component.scss']
})
export class ReleaseNotesComponent extends WidgetComponent implements OnInit {
  unreadReleaseNotes: Array<ReleaseNote> = [];

  constructor(
    private injector: Injector,
    private releaseNotesServices: ReleaseNotesService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.Working();

    this.releaseNotesServices.getLatestReleaseNotes().subscribe(notes => {
      this.unreadReleaseNotes = _.sortBy(notes.filter(n => !this.releaseNotesServices.hasReadReleaseNote(n.id)), x => x.versionNumber);
      this.Ready();
    });
  }

  markReleaseNoteRead(id: number) {
    this.releaseNotesServices.markReleaseNoteRead(id);
    this.unreadReleaseNotes = this.unreadReleaseNotes.filter(n => n.id !== id);
  }

}
