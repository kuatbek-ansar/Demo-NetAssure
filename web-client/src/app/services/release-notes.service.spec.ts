import { TestBed, inject } from '@angular/core/testing';

import { ReleaseNotesService } from './release-notes.service';
import { ApiErrorService, StateService } from './index';
import { ConfigService } from './config.service';
import { mock, instance } from 'ts-mockito/lib/ts-mockito';

describe('ReleaseNotesService', () => {
  const mockReleaseNotesService = mock(ReleaseNotesService);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ReleaseNotesService, useValue: instance(mockReleaseNotesService) },
        ApiErrorService,
        ConfigService,
        StateService]
    });
  });

  it('should be created', inject([ReleaseNotesService], (service: ReleaseNotesService) => {
    expect(service).toBeTruthy();
  }));
});
