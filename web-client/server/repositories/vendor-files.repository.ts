import { Service } from 'typedi/decorators/Service';

import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { VendorFiles } from '../entity';
import { LogService } from '../services';

@Service()
export class VendorFilesRepository extends DataRepository<VendorFiles> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, VendorFiles, log);
  }
}
