import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseNotesComponent } from './release-notes.component';
import { ReleaseNotesService } from '../../../services/index';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { StateService } from '../../../services/state.service';
import { Observable } from 'rxjs/Observable';
import { Injector } from '@angular/core';

describe('ReleaseNotesComponent', () => {
  let component: ReleaseNotesComponent;
  let fixture: ComponentFixture<ReleaseNotesComponent>;

  const mockReleaseNotesService = mock(ReleaseNotesService);
  when(mockReleaseNotesService.getLatestReleaseNotes()).thenReturn(Observable.from([]));
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReleaseNotesComponent],
      providers: [
        { provide: ReleaseNotesService, useValue: instance(mockReleaseNotesService) },
        { provide: Injector, useValue: null },
        StateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
