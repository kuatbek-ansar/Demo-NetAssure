let fs = require('fs');

let sourceConfigFile = process.argv[2];
let destinationConfigFile = process.argv[3];

let config = require(sourceConfigFile);

// AWS deployment settings
config.aws.accessKeyId = '#{AWSStorage-AccessKeyId}';
config.aws.secretKey = '#{AWSStorage-SecretKey}';
config.aws.region = '#{AWSStorage-Region}';
config.aws.bucket = '#{AWSStorage-Bucket}';
config.aws.bucketUrl = '#{AWSStorage-BucketUrl}';
config.aws.backupsDirectory = '#{AWSStorage-BackupsDirectory}';
config.aws.sendMailArn = '#{AWSSNS-SendMailArn}';

// API JWT secret
config.jwtSecret = '#{API-JWTSecret}';

// Salesforce API settings
config.salesforce.apiUser = '#{Salesforce-Username}';
config.salesforce.apiPassword = '#{Salesforce-Password}';
config.salesforce.clientId = '#{Salesforce-ClientId}';
config.salesforce.clientSecret = '#{Salesforce-ClientSecret}';
config.salesforce.healthUrl = '#{Salesforce-HealthUrl}';
config.salesforce.loginUrl = '#{Salesforce-LoginUrl}';
config.salesforce.organizationId = '#{Salesforce-OrganizationId}';
config.salesforce.selfServiceUrl = '#{Salesforce-SelfServiceUrl}';

// Zabbix API settings
config.zabbix.apiUrl = '#{Zabbix-APIUrl}';
config.zabbix.userName = '#{Zabbix-Username}';
config.zabbix.password = '#{Zabbix-Password}';

// AppInsights API settings
config.appInsights.instrumentationKey = '#{AppInsights-instrumentationKey}';

// CosmosDb settings
config.cosmosdb.key = '#{CosmosDb-Key}';
config.cosmosdb.collectionRoot = '#{CosmosDb-CollectionRoot}';
config.cosmosdb.endpoint = '#{CosmosDb-Endpoint}';

// Client CORS origin
config.webClientOrigin = '#{API-WebClientOrigin}';

fs.writeFile(destinationConfigFile, JSON.stringify(config), function (err) {
  if (err) {
    return console.log(`Error Writing File: ${err}`);
  }
});
