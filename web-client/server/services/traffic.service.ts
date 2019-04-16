import { Service } from 'typedi';
import { DocumentClient } from 'documentdb';
import { TrafficRecord } from '../models/traffic-record';
import { LogService } from './log.service';
import { ConfigService } from './config.service';
import { Config } from '../config';

@Service()
export class TrafficService {
  private config: Config;
  constructor(private log: LogService,
    private configService: ConfigService) {
    this.config = configService.GetConfiguration();
  }

  public async GetLastHour(groupid): Promise<Array<TrafficRecord>> {
    const client = new DocumentClient(this.config.cosmosdb.endpoint, { 'masterKey': this.config.cosmosdb.key });
    const collectionUrl = `${this.config.cosmosdb.collectionRoot}topTalkersLastHour`;

    this.log.debug('Calling CosmosDB GetLastHour', { client: client, collectionUrl: collectionUrl });
    return <Promise<Array<TrafficRecord>>>new Promise((resolve, reject) => {
      client.queryDocuments(
        collectionUrl,
        `select top 10 * from root r where r.groupid=\'${groupid}\' order by r.total_bytes desc`
      ).toArray((err, results) => {
        if (err) {
          this.log.error('Error calling CosmosDB GetLastHour', { client: client, collectionUrl: collectionUrl }, err);
          reject(err)
        } else {
          resolve(results.map(x => ({
            ipv4_src_addr: x.ipv4_src_addr,
            total_bytes: x.total_bytes,
            total_in_bytes: x.total_in_bytes,
            total_out_bytes: x.total_out_bytes
          })));
        }
      });
    });
  }
}
