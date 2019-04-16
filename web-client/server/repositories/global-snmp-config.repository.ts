import { Service } from 'typedi/decorators/Service';

import { GlobalSNMPConfiguration } from '../entity';
import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { LogService } from '../services';

@Service()
export class GlobalSNMPConfigurationRepository extends DataRepository<GlobalSNMPConfiguration> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, GlobalSNMPConfiguration, log);
  }
}
