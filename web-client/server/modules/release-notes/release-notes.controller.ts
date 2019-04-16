import { Inject } from 'typedi';

import { ReleaseNote } from '../../../models';
import { ReleaseNoteRepository } from '../../repositories';

import { Path, GET, Errors } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';
import { SystemClock } from '../../utilities';
import { LogService } from '../../services/log.service';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Release Notes')
@Path('/release-notes')
export class ReleaseNotesController {
  @Inject()
  public  releaseNoteRepository: ReleaseNoteRepository;

  @Inject()
  private systemClock: SystemClock;

  @Inject()
  public logService: LogService;

  constructor() {
  }

  @GET
  @Path('/latest')
  public async getLatest(): Promise<ReleaseNote[]> {
    const sevenDaysAgo = this.systemClock.GetNow();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    try {
      const orm = await this.releaseNoteRepository.getOrm();
      const results = await orm.createQueryBuilder('notes')
        .where('notes.releaseDate >= :sevenDaysAgo', {sevenDaysAgo})
        .getMany();

      return results.map(n => <ReleaseNote>{
        id: n.id,
        title: n.title,
        versionNumber: n.versionNumber,
        link: n.link
      });
    } catch (e) {
      this.logService.error('Unable to get latest release notes', {sevenDaysAgo: sevenDaysAgo}, e);
      throw new Errors.InternalServerError();
    }
  }

  @GET
  @Path('/most-recent')
  public async getMostRecent(): Promise<ReleaseNote> {

    try {
      const result = await this.releaseNoteRepository.getMostRecentReleaseNote();
      return result;

    } catch (e) {
      this.logService.error('Unable to get most recent release note', e);
      throw new Errors.InternalServerError();
    }
  }

}
