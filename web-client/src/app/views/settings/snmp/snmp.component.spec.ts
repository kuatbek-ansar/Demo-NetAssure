import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnmpComponent } from './snmp.component';
import { FormsModule } from '@angular/forms';
import { SNMPConfigService, StateService } from '../../../services/index';
import { mock, instance, when, anything, verify } from 'ts-mockito/lib/ts-mockito';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs/Observable';
import { GlobalSNMPConfig } from '../../../../../models/index';

describe('SnmpComponent', () => {
  let component: SnmpComponent;
  let fixture: ComponentFixture<SnmpComponent>;
  let mockSNMPConfig: SNMPConfigService;
  let mockToasterService: ToasterService;

  beforeEach(() => {
    mockSNMPConfig = mock(SNMPConfigService);
    when(mockSNMPConfig.getGlobal()).thenReturn(Observable.from([]));
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
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    beforeEach(() => {
      component = new SnmpComponent(null, instance(mockSNMPConfig), instance(mockToasterService));
    });

    it('should load on init', () => {
      const model = new GlobalSNMPConfig();
      model.version = 'v8';
      when(mockSNMPConfig.getGlobal()).thenReturn(Observable.from([model]));
      component.ngOnInit();
      expect(component.model).toBe(model);
    });

    it('should show and hide loading on init', () => {
      let showed = false;
      let hidden = false;
      component.Ready = () => hidden = true;
      component.Working = () => showed = true;
      const model = new GlobalSNMPConfig();
      model.version = 'v8';
      when(mockSNMPConfig.getGlobal()).thenReturn(Observable.from([model]));
      component.ngOnInit();
      expect(showed).toBeTruthy();
      expect(hidden).toBeTruthy();
    });

    it('should avoid loading null on init', () => {
      when(mockSNMPConfig.getGlobal()).thenReturn(Observable.from([null]));
      component.ngOnInit();
      expect(component.model).not.toBeNull();
    });

    it('should pop up notification on save', () => {
      when(mockSNMPConfig.saveGlobal(anything())).thenReturn(Observable.from([new GlobalSNMPConfig()]));
      component.model = new GlobalSNMPConfig();
      component.save();
      verify(mockToasterService.pop('success', anything())).called();
    });
  });
});
