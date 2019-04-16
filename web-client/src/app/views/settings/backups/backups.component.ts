import { Component, OnInit } from '@angular/core';
import { BackupService } from '../../../services/index';
import { GlobalBackupConfig } from '../../../../../models/index';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.scss']
})
export class BackupsComponent implements OnInit {

  public protocols = [
    { name: 'SSH', port: 22 },
    { name: 'Telnet', port: 23 }
  ];

  model: GlobalBackupConfig;
  constructor(private backupService: BackupService,
    private toasterService: ToasterService) {
    this.model = new GlobalBackupConfig();
  }

  ngOnInit() {
    this.backupService.getGlobalConfig()
      .subscribe((data: GlobalBackupConfig) => {
        this.model = data;
      });
  }

  updateDevicePortNumber() {
    this.model.port = this.protocols
      .find(x => x.name === this.model.protocol).port;
  }

  saveBackups() {
    this.model.enabled = this.model.enabled || false;
    this.model.enablePasswordRequired = this.model.enablePasswordRequired || false;
    this.backupService.saveGlobal(this.model).subscribe((x) => {
      this.toasterService.pop('success', 'Backup settings saved');
    });
  }

}
