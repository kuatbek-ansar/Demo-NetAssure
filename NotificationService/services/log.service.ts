import * as appInsights from 'applicationinsights';
import { Service } from 'typedi';

import { ConfigService } from './config.service';
import { LogLevel } from '../models';

@Service()
export class LogService {
    private logLevel: LogLevel;

    private appInsightsClient: any;

    constructor(private configService: ConfigService) {
        this.logLevel = <any>LogLevel[this.configService.Config.logLevel];

        appInsights.setup(this.configService.Config.appInsights.instrumentationKey)
            .setAutoDependencyCorrelation(false)
            .setAutoCollectRequests(true)
            .setAutoCollectPerformance(true)
            .setAutoCollectExceptions(true)
            .setAutoCollectDependencies(true)
            .setAutoCollectConsole(true)
            .setUseDiskRetryCaching(true);

        appInsights.start();

        this.appInsightsClient = appInsights.defaultClient;
        this.appInsightsClient.trackEvent({ name: 'Starting NotificationService logging' });
    }

    public Trace(message: string, parameters: any, exception: any = null) {
        this.LogItem(LogLevel.TRACE, message, parameters, exception);
    }

    public Debug(message: string, parameters: any, exception: any = null) {
        this.LogItem(LogLevel.DEBUG, message, parameters, exception);
    }

    public Info(message: string, parameters: any, exception: any = null) {
        this.LogItem(LogLevel.INFO, message, exception);
    }

    public Error(message: string, parameters: any, exception: any = null) {
        this.LogItem(LogLevel.ERROR, message, parameters, exception);
    }

    public Critical(message: string, parameters: any, exception: any = null) {
        this.LogItem(LogLevel.CRITICAL, message, parameters, exception);
    }

    private LogItem(level: LogLevel, message: string, parameters: any, exception: Error = null) {
        if (level < this.logLevel) {
            return;
        }

        const logMessageProperties: any = {
            level: level
        };

        if (exception) {
            logMessageProperties.exception = exception.name + ' ' + exception.message;
            logMessageProperties.stack = exception.stack;
        }

        const flatParameters = this.flatten(parameters);

        if (parameters) {
            Object.assign(logMessageProperties, flatParameters);
        }

        this.appInsightsClient.trackEvent({
            name: message,
            properties: logMessageProperties
        });

        const date = new Date().toISOString();

        console.log(`[${date}] - ${LogLevel[level]} ${message} ${JSON.stringify(flatParameters)}`);

        if (exception) {
            console.log(`[${date}] - EXCEPTION ${exception.stack}`);
        }
    }

    // https://gist.github.com/penguinboy/762197#gistcomment-2083577 with minor modification
    private flatten(object, separator = '.') {
        if (!object) {
            return {};
        }

        let currentDepth = 0;
        return Object.assign({}, ...function _flatten(child, path = [], depth) {
            if (currentDepth > 3) {
                return;
            }
            currentDepth++;

            return [].concat(...Object.keys(child).map(
                key => typeof child[key] === 'object'
                && child[key] !== null && child[key] !== undefined
                    ? _flatten(child[key], path.concat([key]), currentDepth + 1)
                    : ({ [path.concat([key]).join(separator)]: child[key] })
            ));
        }(object));
    }
}
