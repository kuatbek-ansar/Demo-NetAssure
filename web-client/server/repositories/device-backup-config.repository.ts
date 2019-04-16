import { Service } from 'typedi/decorators/Service';

import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { DeviceBackupConfiguration } from '../entity';
import { LogService } from '../services';

@Service()
export class DeviceBackupConfigRepository extends DataRepository<DeviceBackupConfiguration> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, DeviceBackupConfiguration, log);
  }
}
