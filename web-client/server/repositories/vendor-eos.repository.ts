import { Service } from 'typedi/decorators/Service';

import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { VendorEos } from '../entity';
import { LogService } from '../services';

@Service()
export class VendorEosRepository extends DataRepository<VendorEos> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, VendorEos, log);
  }
}
