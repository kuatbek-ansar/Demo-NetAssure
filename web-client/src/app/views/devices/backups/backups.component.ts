import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { DeviceBackupConfig } from '../../../../../models';
import { BackupService } from '../../../services';
import { ToasterService } from 'angular2-toaster';
import { AwsVersionedFileViewModel } from '../../../view-models';

@Component({
  selector: 'app-backups',
  templateUrl: 'backups.component.html',
  styleUrls: [
    'backups.component.scss'
  ]
})

export class BackupsComponent implements OnChanges {
  @Input() deviceIp: string;

  @Input() deviceId: string;

  public backups: AwsVersionedFileViewModel[];

  public ovrrideCredentials: boolean;

  public protocols = [
    { name: 'SSH', port: 22 },
    { name: 'Telnet', port: 23 }
  ];

  public model: DeviceBackupConfig;

  areBackupsLoading: boolean;

  constructor(private backupService: BackupService,
    private toasterService: ToasterService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.backupService.getDeviceConfig(parseInt(this.deviceId, 10))
      .subscribe((data: DeviceBackupConfig) => {
        this.model = data;
      });

    this.ovrrideCredentials = false;
    this.model = new DeviceBackupConfig();

    this.areBackupsLoading = true;
    this.backupService.getBackups(this.deviceIp)
      .subscribe((data: AwsVersionedFileViewModel[]) => {
        this.backups = data.length > 0 ? data : null;
        this.areBackupsLoading = false;
      });
  }

  updateDevicePortNumber() {
    this.model.port = this.protocols
      .find(x => x.name === this.model.protocol).port;
  }

  saveBackups() {
    this.model.device_id = parseInt(this.deviceId, 10);
    this.model.enabled = this.model.enabled || false;
    this.model.enablePasswordRequired = this.model.enablePasswordRequired || false;
    this.model.overrideCredentials = this.model.overrideCredentials || false;
    this.backupService.saveDevice(this.model).subscribe((x) => {
      this.toasterService.pop('success', 'Backup settings saved');
    });
  }
}
