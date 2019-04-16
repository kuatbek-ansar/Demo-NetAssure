
import { ReleaseNotesController } from './release-notes.controller';
import { ReleaseNoteRepository } from '../../repositories';
import { LogService } from '../../services/log.service';

import { expect } from 'chai'
import { Container } from 'typedi';
import { mock, instance, when, verify } from 'ts-mockito/lib/ts-mockito';

import { Repository } from 'typeorm';
import { DataRepository } from '../../repositories/data.repository';
import { ReleaseNote } from '../../entity';


describe('Release Notes Controller: Unit', () => {
  let sut: ReleaseNotesController;
  const mockReleaseNotesRepository = mock(ReleaseNoteRepository);
  const mockLogService = mock(LogService);


  beforeEach(function () {

    when(mockReleaseNotesRepository.getMostRecentReleaseNote()).thenReturn(Promise.resolve(new ReleaseNote()));

    sut = new ReleaseNotesController();

    sut.releaseNoteRepository = instance(mockReleaseNotesRepository);
    sut.logService = instance(mockLogService);
  });

  describe('getMostRecent', () => {

    it('should fetch one result from the database', async () => {

      const result = await sut.getMostRecent();
      verify(mockReleaseNotesRepository.getMostRecentReleaseNote()).once();

    });

  });

});
