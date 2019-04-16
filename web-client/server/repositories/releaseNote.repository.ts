import { Service } from 'typedi/decorators/Service';

import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { ReleaseNote } from '../entity';
import { LogService } from '../services';

@Service()
export class ReleaseNoteRepository extends DataRepository<ReleaseNote> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, ReleaseNote, log);
  }

  public async getMostRecentReleaseNote(): Promise<ReleaseNote> {

    const orm = await this.getOrm();

    const result = await orm.createQueryBuilder('notes')
      .orderBy('notes.releaseDate', 'DESC')
      .getOne();

    return result;

  }

}
