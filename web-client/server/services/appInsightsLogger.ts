import { Logger, QueryRunner } from 'typeorm';
import { LogService } from './log.service';
import * as appInsights from 'applicationinsights';

export class AppInsightsLogger implements Logger {
  constructor(private logService: LogService) { }
  /**
  * Logs query and parameters used in it.
  */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    const date = new Date().toISOString();
    try {
      appInsights.defaultClient.trackEvent({ name: query, properties: { parameters: (parameters || []).join(',') } });
    } catch (e) {
      console.error('Unable to log query to appInsights', query, e);
    }
  }

  /**
   * Logs query that has failed.
   */
  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    try {
      appInsights.defaultClient.trackException({
        exception: new Error(error),
        properties: {
          query: query,
          parameters: (parameters || []).join(',')
        }
      });
    } catch (e) {
      console.error('Unable to log query error to appInsights', query, e);
    }
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    try {
      appInsights.defaultClient.trackEvent({
        name: 'slow query',
        properties: {
          query: query,
          parameters: (parameters || []).join(',')
        }
      });
    } catch (e) {
      console.error('Unable to log slow query to appInsights', query, e);
    }
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    try {
      appInsights.defaultClient.trackEvent({ name: message });
    } catch (e) {
      console.error('Unable to log schema build to appInsights', message, e);
    }
  }

  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, queryRunner?: QueryRunner): any {
    try {
      appInsights.defaultClient.trackEvent({ name: message });
    } catch (e) {
      console.error('Unable to log migration to appInsights', message, e);
    }
  }

  /**
   * Perform logging using given logger, or by default to the log service.
   * Log has its own level and message.
   */
  log(level: string, message: any, queryRunner?: QueryRunner): any {
    try {
      appInsights.defaultClient.trackEvent({ name: message, properties: { level: level } });
    } catch (e) {
      console.error('Unable to log to appInsights', message, e);
    }
  }
}
