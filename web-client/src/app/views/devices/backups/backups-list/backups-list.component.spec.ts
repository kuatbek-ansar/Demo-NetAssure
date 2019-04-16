import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/primeng';
import { BackupService } from '../../../../services';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
import { mock, instance, when } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import { BackupsListComponent } from './backups-list.component';
import { BsModalService } from 'ngx-bootstrap';
import { AppNoDataComponent } from '../../../../components';
import { MockComponent } from 'mock-component';
import { TimeAgoPipe } from '../../../../pipes';
import { TableModule } from 'primeng/table';


describe('Backups list', () => {
  let component: BackupsListComponent;
  let fixture: ComponentFixture<BackupsListComponent>;
  const deviceId = '11';
  const deviceIp = '11.11.11.11';
  const mockModalService = mock(BsModalService);
  const mockBackupService = mock(BackupService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BackupsListComponent, MockComponent(AppNoDataComponent), TimeAgoPipe],
      imports: [FormsModule, TableModule, CalendarModule],
      providers: [
        { provide: BackupService, useValue: instance(mockBackupService) },
        { provide: BsModalService, useValue: instance(mockModalService) }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
