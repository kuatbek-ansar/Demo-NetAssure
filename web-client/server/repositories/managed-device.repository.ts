import { Service } from 'typedi/decorators/Service';

import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { ManagedDevice } from '../entity';
import { LogService } from '../services';

@Service()
export class ManagedDeviceRepository extends DataRepository<ManagedDevice> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, ManagedDevice, log);
  }
}
