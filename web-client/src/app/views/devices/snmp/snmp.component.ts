import { Component, Injector, Input, OnChanges, SimpleChanges  } from '@angular/core';
import { DeviceSNMPConfig } from '../../../../../models'
import { SNMPConfigService } from '../../../services/index';
import { ToasterService } from 'angular2-toaster';
import { WidgetComponent } from '../../../containers/index';

@Component({
  selector: 'device-snmp-config',
  templateUrl: './snmp.component.html',
  styleUrls: ['./snmp.component.scss']
})
export class SnmpComponent extends WidgetComponent implements OnChanges {
  @Input() selectedDeviceId: string;
  model: DeviceSNMPConfig;
  constructor(injector: Injector,
    private snmpService: SNMPConfigService,
    private toasterService: ToasterService) {
    super(injector);
    this.model = new DeviceSNMPConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.Working();
    this.snmpService.getDevice(this.selectedDeviceId).subscribe(x => {
      if (x) {
        this.model = x;
      } else {
        this.model = new DeviceSNMPConfig();
        this.model.deviceId = this.selectedDeviceId;
      }
      this.Ready();
    });
  }

  save() {
    this.snmpService.saveDevice(this.selectedDeviceId, this.model).subscribe((x) => {
      this.toasterService.pop('success', 'SNMP settings saved');
    });
  }
}
