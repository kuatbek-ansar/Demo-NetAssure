import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GlobalModule } from '../../global.module';
import { BackupService, SNMPConfigService } from '../../services';
import { BackupsComponent } from './backups/backups.component';
import { SnmpComponent } from './snmp/snmp.component';
import { SettingsRoutingModule} from './settings-routing.module';


@NgModule({
    imports: [
        SettingsRoutingModule,
        GlobalModule,
        NgbModule.forRoot(),
        ModalModule.forRoot(),
    ],
    declarations: [
        BackupsComponent,
        SnmpComponent],
    providers: [
        BackupService,
        SNMPConfigService
    ],
    entryComponents: [
    ]
})
export class SettingsModule {
}
