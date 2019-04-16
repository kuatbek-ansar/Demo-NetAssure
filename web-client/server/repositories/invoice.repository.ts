import { Service } from 'typedi/decorators/Service';

import { Invoice } from '../entity';
import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { LogService } from '../services';

@Service()
export class InvoiceRepository extends DataRepository<Invoice> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, Invoice, log);
  }
}
