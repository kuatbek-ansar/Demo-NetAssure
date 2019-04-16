import { Service } from 'typedi/decorators/Service';

import { Circuit } from '../entity';
import { ConnectionManager } from './connection-manager';
import { DataRepository } from './data.repository';
import { LogService } from '../services';

@Service()
export class CircuitRepository extends DataRepository<Circuit> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, Circuit, log);
  }
}
