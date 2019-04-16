import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService {
  constructor(
    public Config: AppConfig,
    private http: HttpClient
  ) {
  }

  public GetApiUrl(endPointUrl: string): string {
    return `${environment.apiUrl}/${endPointUrl}`;
  }

  public GetToken(): string {
    return localStorage.getItem('Token');
  }

  public Load(): Promise<AppConfig> {
    return new Promise((resolve) => {
      this.http.get('config/config.json')
        .subscribe((config: AppConfig) => {
          this.Config = config;

          resolve(this.Config);
        }, (error: any) => {
          this.Config = new AppConfig();

          resolve(this.Config);
        });
    });
  }

  public Version(): string {
    return this.Config.Version;
  }

  public Get(key: any): any {
    return this.Config[key];
  }
}

export function ConfigServiceFactory(config: ConfigService) {
  return () => config.Load();
}
