import { Service } from 'typedi/decorators/Service';

import { Toggle } from '../entity';
import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { LogService } from '../services';

@Service()
export class ToggleRepository extends DataRepository<Toggle> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, Toggle, log);
  }
}
