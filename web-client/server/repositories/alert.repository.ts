import { Service } from 'typedi/decorators/Service';

import { Alert } from '../entity';
import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { LogService } from '../services';

@Service()
export class AlertRepository extends DataRepository<Alert> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, Alert, log);
  }
}
