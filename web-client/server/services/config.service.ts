import { Service } from 'typedi';
import { Config } from '../config';

@Service()
export class ConfigService {
  public GetConfiguration(): Config {
    if ((<any>global).config) {
      return (<any>global).config;
    }
    const config = require('../config/config.json');
    this.recursiveSet(config);
    return config;
  }
  recursiveSet(config: any, prefix: string = '') {
    if (!config) {
      return;
    }
    for (const key in config) {
      if (config.hasOwnProperty(key)) {
        const envValue = process.env[prefix + key];
        if (envValue) {
          config[key] = envValue;
        } else if (typeof (config[key]) !== 'string') {
          this.recursiveSet(config[key], key + ':');
        }
      }
    }
  }
}
