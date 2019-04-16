import { Service } from 'typedi/decorators/Service';

import { NotificationTypes } from '../entity';
import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { LogService } from '../services';

@Service()
export class NotificationTypeRepository extends DataRepository<NotificationTypes> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, NotificationTypes, log);
  }
}
