import { Service } from 'typedi/decorators/Service';

import { NetworkMap } from '../entity';
import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { LogService } from '../services';

@Service()
export class NetworkMapRepository extends DataRepository<NetworkMap> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, NetworkMap, log);
  }
}
