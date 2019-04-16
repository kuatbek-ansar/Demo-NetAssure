import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Repository } from 'typeorm/repository/Repository';

import { ConnectionManager } from './connection-manager';

export interface IDataRepository<T> {
  manager: ConnectionManager;

  find(options?: FindManyOptions<T>): Promise<T[]>;

  getOrm(): Promise<Repository<T>>;
}
