import { AWSConfig } from './aws-config';
import { SalesforceConfig } from './salesforce-config';
import { ZabbixConfig } from './zabbix-config';
import { AppInsightsConfig } from './appinsights-config';
import { CosmosDbConfig } from './cosmosdb-config';

export class Config {
  public aws: AWSConfig;
  public jwtSecret: string;
  public salesforce: SalesforceConfig;
  public zabbix: ZabbixConfig;
  public appInsights: AppInsightsConfig;
  public cosmosdb: CosmosDbConfig;
  public webClientOrigin: string;
  public logLevel: string;
  constructor() {
    this.aws = new AWSConfig();
    this.salesforce = new SalesforceConfig();
    this.zabbix = new ZabbixConfig();
    this.appInsights = new AppInsightsConfig();
    this.cosmosdb = new CosmosDbConfig();
  }
}
