import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Top10UtilizedInterfacesComponent } from './top10-utilized-interfaces.component';
import { mock, instance, when, verify, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../../rxjs-imports';
import { ReportsService, StateService } from '../../../services';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';

describe('Top10UtilizedInterfacesComponent', () => {
  let component: Top10UtilizedInterfacesComponent;
  let fixture: ComponentFixture<Top10UtilizedInterfacesComponent>;
  let mockReportsService: ReportsService;

  beforeEach(() => {
    mockReportsService = mock(ReportsService);
    when(mockReportsService.getTop10UtilizedInterfaces()).thenReturn(Observable.from([]));
  });

  describe('rendering', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [Top10UtilizedInterfacesComponent, AppWidgetLoadingComponent],
        imports: [TableModule, RouterModule],
        providers: [{ provide: ReportsService, useValue: instance(mockReportsService) },
          StateService]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      resetCalls(mockReportsService);
      fixture = TestBed.createComponent(Top10UtilizedInterfacesComponent);
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
      component = new Top10UtilizedInterfacesComponent(null, instance(mockReportsService));
    });

    it('should call the report service on init', () => {
      // once on init
      component.ngOnInit();
      verify(mockReportsService.getTop10UtilizedInterfaces()).once();
    });

    it('should call report service from getData()', () => {
      component.ngOnInit();
      component.getData();
      // once on init, once during the test
      verify(mockReportsService.getTop10UtilizedInterfaces()).twice();
    });
  });

});
