import { Service } from 'typedi/decorators/Service';

import { AlertGroup } from '../entity';
import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { LogService } from '../services';

@Service()
export class AlertGroupRepository extends DataRepository<AlertGroup> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, AlertGroup, log);
  }
}
