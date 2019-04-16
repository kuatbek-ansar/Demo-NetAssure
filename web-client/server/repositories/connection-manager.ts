import { createConnection, Connection, getConnectionOptions } from 'typeorm';
import { Service } from 'typedi';
import { AppInsightsLogger } from '../services/appInsightsLogger';
import { entities } from '../entity/entities';
import { LogService } from '../services';

@Service()
export class ConnectionManager {
  private connection: Connection;

  constructor(private log: LogService) {
  }

  public async getConnection() {
    if (!this.connection) {
      try {
        const connectionOptions = await getConnectionOptions();

        this.log.debug('Connecting to Database', null); // null to avoid sending credentials to log
        this.connection = await createConnection(Object.assign(connectionOptions, {
          logger: new AppInsightsLogger(this.log),
          entities: entities
        }));
      } catch (ex) {
        this.log.critical('Unable to create DB connection', null, ex);
      }
    }

    return this.connection;
  }
}
