import { Injectable, Injector } from '@angular/core';
import { HttpService } from './http.service';
import { ReleaseNote } from '../../../models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ReleaseNotesService extends HttpService {

  private ReadNoteIdsKey = 'ReadReleaseNoteIds';

  constructor(private injector: Injector) {
    super(injector);
  }

  public getMostRecentReleaseNote(): Observable<ReleaseNote> {
    return super.get(this.ApiUrls.GetReleaseNotesMostRecent)
  }

  public getLatestReleaseNotes(): Observable<ReleaseNote[]> {
    return super.get(this.ApiUrls.GetReleaseNotesLatest);
  }

  public hasReadReleaseNote(id: number): boolean {
    return !!this.getReadReleaseNoteIds().find(readId => readId === id);
  }

  public markReleaseNoteRead(id: number) {
    const readNoteIds = this.getReadReleaseNoteIds();

    if (!this.getReadReleaseNoteIds().find(readId => readId === id)) {
      readNoteIds.push(id);
    }

    this.setReadReleaseNoteIds(readNoteIds);
  }

  private getReadReleaseNoteIds(): Array<number> {
    const idsString = localStorage.getItem(this.ReadNoteIdsKey);

    if (idsString) {
      return JSON.parse(idsString);
    }

    return [];
  }

  private setReadReleaseNoteIds(ids: Array<number>) {
    localStorage.setItem(this.ReadNoteIdsKey, JSON.stringify(ids));
  }

}
