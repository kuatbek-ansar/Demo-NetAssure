import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupsComponent } from './backups.component';
import { FormsModule } from '@angular/forms';
import { AppNoDataComponent } from '../../../components/index';
import { CalendarModule } from 'primeng/primeng';
import { BackupService } from '../../../services';
import { StateService } from '../../../services/state.service';
import { ApiErrorService } from '../../../services/api-error.service';
import { Injector } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { AppConfig } from '../../../models/index';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { DeviceBackupConfig } from '../../../../../models/index';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
import { mock, instance, when } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import { BackupsListComponent } from './backups-list';
import { TimeAgoPipe } from '../../../pipes';
import { MockComponent } from 'mock-component';
import { TableModule } from 'primeng/table';


describe('BackupsComponent', () => {
  let component: BackupsComponent;
  let fixture: ComponentFixture<BackupsComponent>;
  const deviceId = '11';
  const deviceIp = '11.11.11.11';
  const mockToasterService = mock(ToasterService);
  const mockBackupService = mock(BackupService);
  when(mockBackupService.getBackups(deviceIp)).thenReturn(Observable.from([]));
  when(mockBackupService.getDeviceConfig(parseInt(deviceId, 10))).thenReturn(Observable.from([]));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BackupsComponent,
        AppNoDataComponent,
        MockComponent(BackupsListComponent)],
      imports: [FormsModule, TableModule, CalendarModule],
      providers: [
        { provide: BackupService, useValue: instance(mockBackupService) },
        { provide: ToasterService, useValue: instance(mockToasterService) },
        { provide: Injector, useValue: null }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupsComponent);
    component = fixture.componentInstance;
    component.deviceId = deviceId;
    component.deviceIp = deviceIp;
    component.model = new DeviceBackupConfig();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
