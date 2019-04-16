import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AwsFileViewModel } from '../view-models';
import { DeviceBackupConfig, GlobalBackupConfig } from 'app/../../models';
import { HttpService } from './http.service';
import { StateService } from './state.service';

@Injectable()
export class BackupService extends HttpService {
  constructor(
    private injector: Injector,
    private state: StateService
  ) {
    super(injector);
  }

  public getBackups(deviceIp: string): Observable<any> {
    const groupId = this.state.User.HostGroup.Id;

    return super.get(`${this.ApiUrls.Backups}/backups/${groupId}/${deviceIp}`)
      .map((data: AwsFileViewModel[]) => {
        data.forEach(x => {
          const d = new Date(x.lastModified);
          x.lastModifiedDateStamp = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
        });

        return data;
      });
  }

  public downloadBackup(path: string, version: string) {
    return super.get(`${this.ApiUrls.Backups}/getUrl?path=${path}&version=${version}`);
  }

  public getDownloadText(path: string, version: string) {
    return super.get(`${this.ApiUrls.Backups}/getContent?path=${path}&version=${version}`, {responseType: 'text'});
  }

  public getGlobalConfig(): Observable<GlobalBackupConfig> {
    return super.get(`${this.ApiUrls.Backups}/config`);
  }

  public getDeviceConfig(deviceId: number): Observable<DeviceBackupConfig> {
    return super.get(`${this.ApiUrls.Backups}/config/${deviceId}`)
  }

  public saveDevice(model: DeviceBackupConfig) {
    return super.post(`${this.ApiUrls.Backups}/deviceconfig`, model);
  }

  public saveGlobal(model: GlobalBackupConfig) {
    return super.post(`${this.ApiUrls.Backups}/config`, model);
  }
}
