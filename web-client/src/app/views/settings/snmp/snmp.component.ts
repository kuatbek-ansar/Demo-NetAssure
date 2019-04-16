import { Component, OnInit, Injector } from '@angular/core';
import { GlobalSNMPConfig } from '../../../../../models'
import { SNMPConfigService } from '../../../services/index';
import { ToasterService } from 'angular2-toaster';
import { BaseComponent } from '../../../containers/index';

@Component({
  selector: 'app-snmp',
  templateUrl: './snmp.component.html',
  styleUrls: ['./snmp.component.scss']
})
export class SnmpComponent extends BaseComponent implements OnInit {

  model: GlobalSNMPConfig;
  constructor(injector: Injector,
    private snmpService: SNMPConfigService,
    private toasterService: ToasterService) {
    super(injector);
    this.model = new GlobalSNMPConfig();
  }

  ngOnInit() {
    this.Working();
    this.snmpService.getGlobal().subscribe(x => {
      if (x) {
        this.model = x;
      }
      this.Ready();
    });
  }

  save() {
    this.snmpService.saveGlobal(this.model).subscribe((x) => {
      this.toasterService.pop('success', 'SNMP settings saved');
    });
  }
}
