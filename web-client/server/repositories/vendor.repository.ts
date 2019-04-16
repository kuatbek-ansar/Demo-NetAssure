import { Service } from 'typedi/decorators/Service';

import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { Vendor } from '../entity';
import { LogService } from '../services';

@Service()
export class VendorRepository extends DataRepository<Vendor> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, Vendor, log);
  }
}
