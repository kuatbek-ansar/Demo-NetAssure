import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Repository, FindOneOptions } from 'typeorm';

import { ConnectionManager } from './connection-manager';
import { IDataRepository } from './data.interface';
import { LogService } from '../services/log.service';

export type ObjectType<T> = { new(): T } | Function;

export abstract class DataRepository<T> implements IDataRepository<T> {
  constructor(public manager: ConnectionManager, public type: ObjectType<T>, private logService: LogService) {
  }

  public async find(options?: FindManyOptions<T>): Promise<T[]> {
    this.logService.debug('Calling DB find', { options: options, type: this.type.name });
    const repository = await this.getOrm();
    const results = await repository.find(options);

    return results as T[];
  }

  public async findOne(options?: FindOneOptions<T>): Promise<T> {
    this.logService.debug('Calling DB findOne', { options: options, type: this.type.name });
    const repository = await this.getOrm();
    const result = await repository.findOne(options);

    return result as T;
  }

  public async getOrm(): Promise<Repository<T>> {
    const connection = await this.manager.getConnection();

    if (!connection) {
      this.logService.critical('ORM Connection not set', null);
    }

    return connection.getRepository(this.type);
  }
}
