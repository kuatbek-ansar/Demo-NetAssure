import { AWSConfig } from './aws-config';
import { AppInsightsConfig } from './appinsights-config';

export class Config {
    public aws: AWSConfig;

    public apiUrl: string;

    public apiUser: string;

    public apiPassword: string;

    public appInsights: AppInsightsConfig;

    public logLevel: string;

    constructor() {
        this.aws = new AWSConfig();
        this.appInsights = new AppInsightsConfig();
    }
}
