import { Service } from 'typedi';
import { DocumentClient } from 'documentdb';
import { Layer7Record } from '../models/layer7-record';
import { LogService } from './log.service';
import { Config } from '../config';
import { ConfigService } from './config.service';

@Service()
export class Layer7Service {
  private config: Config;
  constructor(private log: LogService,
    private configService: ConfigService) {
    this.config = configService.GetConfiguration();
  }

  public async GetLastHour(groupid): Promise<Array<Layer7Record>> {
    const client = new DocumentClient(this.config.cosmosdb.endpoint, { 'masterKey': this.config.cosmosdb.key });
    const collectionUrl = `${this.config.cosmosdb.collectionRoot}layer7`;

    this.log.debug('Calling Layer7 GetLastHour', { client: client, collectionUrl: collectionUrl });
    return <Promise<Array<Layer7Record>>>new Promise((resolve, reject) => {
      client.queryDocuments(
        collectionUrl,
        `select * from root r where  r.groupid='${groupid}' order by r.total_bytes desc`
      ).toArray((err, results) => {
        if (err) {
          this.log.error('Error calling Layer7 GetLastHour',
            { client: client, collectionUrl: collectionUrl, groupId: groupid }, err);
          reject(err)
        } else {
          resolve(results.map(x => ({
            l7_proto_name: x.l7_proto_name,
            total_bytes: x.total_bytes
          })));
        }
      });
    });
  }

  public async GetLastHourForProtocol(groupid, protocol): Promise<Array<Layer7Record>> {
    const client = new DocumentClient(this.config.cosmosdb.endpoint, { 'masterKey': this.config.cosmosdb.key });
    const collectionUrl = `${this.config.cosmosdb.collectionRoot}layer7byhost`;

    this.log.debug('Calling Layer7 GetLastHourForProtocol', { client: client, collectionUrl: collectionUrl });
    return <Promise<Array<Layer7Record>>>new Promise((resolve, reject) => {
      client.queryDocuments(
        collectionUrl,
        `select top 20 * from root r
                  where r.l7_proto_name='${protocol}' and
                        r.groupid='${groupid}'
                  order by r.total_bytes desc`
      ).toArray((err, results) => {
        if (err) {
          this.log.error('Error calling Layer7 GetLastHourForProtocol',
            { client: client, collectionURl: collectionUrl, groupId: groupid }, err);
          reject(err);
        } else {
          const mappedResult = results.map(x => ({
            ipv4_src_addr: x.ipv4_src_addr,
            total_bytes: x.total_bytes
          }));
          resolve(mappedResult);
        }
      });
    });
  }
}
