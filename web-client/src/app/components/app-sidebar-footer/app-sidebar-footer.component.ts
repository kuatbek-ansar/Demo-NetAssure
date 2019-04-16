import { Component, OnInit, Injector } from '@angular/core';
import { ReleaseNote } from '../../../../models/release-note.model';
import { ReleaseNotesService } from '../../services/release-notes.service';
import { WidgetComponent, BaseComponent } from '../../containers';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-sidebar-footer',
  templateUrl: './app-sidebar-footer.component.html'
})
export class AppSidebarFooterComponent extends WidgetComponent implements OnInit {

  public currentReleaseNote: ReleaseNote;

  constructor(
    private injector: Injector,
    private releaseNotesServices: ReleaseNotesService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.Working();

    this.releaseNotesServices.getMostRecentReleaseNote().subscribe(note => {
      this.currentReleaseNote = note;
      this.Ready();
    });


  }

}
