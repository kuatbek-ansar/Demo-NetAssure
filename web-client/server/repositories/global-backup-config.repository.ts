import { Service } from 'typedi/decorators/Service';

import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { GlobalBackupConfiguration } from '../entity';
import { LogService } from '../services';

@Service()
export class GlobalBackupConfigRepository extends DataRepository<GlobalBackupConfiguration> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, GlobalBackupConfiguration, log);
  }
}
