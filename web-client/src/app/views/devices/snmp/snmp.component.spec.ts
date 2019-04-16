import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnmpComponent } from './snmp.component';
import { FormsModule } from '@angular/forms';
import { SNMPConfigService, StateService } from '../../../services/index';
import { mock, instance, when, anything, verify } from 'ts-mockito/lib/ts-mockito';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs/Observable';
import { DeviceSNMPConfig } from '../../../../../models/index';

describe('SnmpComponent', () => {
  let component: SnmpComponent;
  let fixture: ComponentFixture<SnmpComponent>;
  let mockSNMPConfig: SNMPConfigService;
  let mockToasterService: ToasterService;

  beforeEach(() => {
    mockSNMPConfig = mock(SNMPConfigService);
      when(mockSNMPConfig.getDevice('1')).thenReturn(Observable.from([]));
      mockToasterService = mock(ToasterService);
  });

  describe('rendering', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [SnmpComponent],
        imports: [FormsModule],
        providers: [
          { provide: SNMPConfigService, useValue: instance(mockSNMPConfig) },
          { provide: ToasterService, useValue: instance(mockToasterService) },
          StateService]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SnmpComponent);
      component = fixture.componentInstance;
      component.selectedDeviceId = '1';
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    beforeEach(() => {
      component = new SnmpComponent(null, instance(mockSNMPConfig), instance(mockToasterService));
      component.selectedDeviceId = '1';
    });

    it('should load on changes', () => {
      const model = new DeviceSNMPConfig();
      model.version = 'v8';
      when(mockSNMPConfig.getDevice('1')).thenReturn(Observable.from([model]));
      component.ngOnChanges(null);
      expect(component.model).toBe(model);
    });

    it('should show and hide loading on init', () => {
      let showed = false;
      let hidden = false;
      component.Ready = () => hidden = true;
      component.Working = () => showed = true;
      const model = new DeviceSNMPConfig();
      model.version = 'v8';
      when(mockSNMPConfig.getDevice('1')).thenReturn(Observable.from([model]));
      component.ngOnChanges(null);
      expect(showed).toBeTruthy();
      expect(hidden).toBeTruthy();
    });

    it('should avoid loading null on init', () => {
      when(mockSNMPConfig.getDevice('1')).thenReturn(Observable.from([null]));
      component.ngOnChanges(null);
      expect(component.model).not.toBeNull();
    });

    it('should pop up notification on save', () => {
      when(mockSNMPConfig.saveDevice('1', anything())).thenReturn(Observable.from([new DeviceSNMPConfig()]));
      component.model = new DeviceSNMPConfig();
      component.save();
      verify(mockToasterService.pop('success', anything())).called();
    });
  })
});
