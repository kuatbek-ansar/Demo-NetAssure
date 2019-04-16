import { Service } from 'typedi/decorators/Service';

import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { DeviceInterface } from '../entity';
import { LogService } from '../services';

@Service()
export class DeviceInterfaceRepository extends DataRepository<DeviceInterface> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, DeviceInterface, log);
  }
}
