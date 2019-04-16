import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupsComponent } from './backups.component';
import { FormsModule } from '@angular/forms';
import { BackupService } from '../../../services/index';
import { mock, instance, when, anything, verify } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import { ToasterService } from 'angular2-toaster';
import { ToasterModule } from 'angular2-toaster/src/toaster.module';
import { GlobalBackupConfig } from '../../../../../models/index';

describe('BackupsComponent', () => {
  let component: BackupsComponent;
  let fixture: ComponentFixture<BackupsComponent>;
  const mockBackupService = mock(BackupService);
  const mockToasterService = mock(ToasterService);

  beforeEach(() => {
    when(mockBackupService.getGlobalConfig()).thenReturn(Observable.from([]));
  });

  describe('rendering', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [BackupsComponent],
        imports: [FormsModule, ToasterModule],
        providers: [
          { provide: BackupService, useValue: instance(mockBackupService) },
          { provide: ToasterService, useValue: instance(mockToasterService) },
        ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(BackupsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('behaviour', () => {

    beforeEach(() => {
      component = new BackupsComponent(instance(mockBackupService), instance(mockToasterService));
    });

    it('should have default protocols', () => {
      expect(component.protocols).toBeTruthy();
      expect(component.protocols.length).toEqual(2);
      expect(component.protocols[0]).toEqual({name: 'SSH', port: 22});
      expect(component.protocols[1]).toEqual({name: 'Telnet', port: 23});
    });

    it('should update port number', () => {
      component.model.protocol = 'SSH';
      component.updateDevicePortNumber();
      expect(component.model.port).toBe(22);

      component.model.protocol = 'Telnet';
      component.updateDevicePortNumber();
      expect(component.model.port).toBe(23);
    });

    it('should set defaults on save', () => {
      when(mockBackupService.saveGlobal(anything())).thenReturn(Observable.from([]));
      component.model = new GlobalBackupConfig();
      component.saveBackups();
      expect(component.model.enabled).toBeFalsy();
      expect(component.model.enablePasswordRequired).toBeFalsy();
    });

    it('should pop up notification on save', () => {
      when(mockBackupService.saveGlobal(anything())).thenReturn(Observable.from([{}]));
      component.model = new GlobalBackupConfig();
      component.saveBackups();
      verify(mockToasterService.pop('success', anything())).called();
    });
  });
});
