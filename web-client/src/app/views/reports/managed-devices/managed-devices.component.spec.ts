import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagedDevicesComponent } from './managed-devices.component';
import { mock, instance, when, verify, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../../rxjs-imports';
import { ReportsService, StateService } from '../../../services';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';

describe('ManagedDevicesComponent', () => {
  let component: ManagedDevicesComponent;
  let fixture: ComponentFixture<ManagedDevicesComponent>;
  let mockReportsService: ReportsService;

  beforeEach(() => {
    mockReportsService = mock(ReportsService);
    when(mockReportsService.getManagedDevices()).thenReturn(Observable.from([]));
  })

  describe('rendering', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ ManagedDevicesComponent , AppWidgetLoadingComponent],
        imports: [TableModule, RouterModule],
        providers: [{ provide: ReportsService, useValue: instance(mockReportsService) },
          StateService]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      resetCalls(mockReportsService);
      fixture = TestBed.createComponent(ManagedDevicesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('behaviour', () => {

    beforeEach(() => {
      resetCalls(mockReportsService);
      component = new ManagedDevicesComponent(null, instance(mockReportsService));
    });

    it('should call the report service on init', () => {
      // once on init
      component.ngOnInit();
      verify(mockReportsService.getManagedDevices()).once();
    });

  });
});
