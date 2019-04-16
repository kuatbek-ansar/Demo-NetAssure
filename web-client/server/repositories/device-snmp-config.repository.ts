import { Service } from 'typedi/decorators/Service';

import { DeviceSNMPConfiguration } from '../entity';
import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { LogService } from '../services';

@Service()
export class DeviceSNMPConfigurationRepository extends DataRepository<DeviceSNMPConfiguration> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, DeviceSNMPConfiguration, log);
  }
}
