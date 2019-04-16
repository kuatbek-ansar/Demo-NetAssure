import * as appInsights from 'applicationinsights';
import { Service } from 'typedi';
import { ConfigService } from './config.service';

export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
  CRITICAL
}

@Service()
export class LogService {
  logLevel: LogLevel;
  constructor(private configService: ConfigService) {
    const config = configService.GetConfiguration();
    this.logLevel = <any>LogLevel[config.logLevel];
  }

  public trace(message: string, parameters: any, exception: any = null) {
    this.logItem(LogLevel.TRACE, message, parameters, exception);
  }
  public debug(message: string, parameters: any, exception: any = null) {
    this.logItem(LogLevel.DEBUG, message, parameters, exception);
  }
  public info(message: string, parameters: any, exception: any = null) {
    this.logItem(LogLevel.INFO, message, exception);
  }
  public error(message: string, parameters: any, exception: any = null) {
    this.logItem(LogLevel.ERROR, message, parameters, exception);
  }
  public critical(message: string, parameters: any, exception: any = null) {
    this.logItem(LogLevel.CRITICAL, message, parameters, exception);
  }

  private logItem(level: LogLevel, message: string, parameters: any, exception: Error = null) {
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
    appInsights.defaultClient.trackEvent({
      name: message,
      properties: logMessageProperties
    });

    const date = new Date().toISOString();

    console.log(`[${date}] ${LogLevel[level]} ${message} ${JSON.stringify(flatParameters)}`);
    if (exception) {
      console.log(`[${date}] EXCEPTION ${exception.stack}`);
    }
  }

  // proudly stolen from: https://gist.github.com/penguinboy/762197#gistcomment-2083577 with minor modification
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
      return [].concat(...Object.keys(child).map(key => typeof child[key] === 'object' && child[key] !== null && child[key] !== undefined
        ? _flatten(child[key], path.concat([key]), currentDepth + 1)
        : ({ [path.concat([key]).join(separator)]: child[key] })
      ));
    }(object));
  }
}
