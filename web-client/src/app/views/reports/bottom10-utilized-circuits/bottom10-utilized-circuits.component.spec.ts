import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Bottom10UtilizedCircuitsComponent } from './bottom10-utilized-circuits.component';
import { mock, instance, when, verify, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../../rxjs-imports';
import { ReportsService, StateService } from '../../../services';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';

describe('Bottom10UtilizedCircuitsComponent', () => {
  let component: Bottom10UtilizedCircuitsComponent;
  let fixture: ComponentFixture<Bottom10UtilizedCircuitsComponent>;
  let mockReportsService: ReportsService;

  describe('rendering', () => {
    beforeEach(async(() => {
      mockReportsService = mock(ReportsService);
      when(mockReportsService.getBottom10UtilizedCircuits()).thenReturn(Observable.from([]));
      TestBed.configureTestingModule({
        declarations: [Bottom10UtilizedCircuitsComponent, AppWidgetLoadingComponent],
        imports: [TableModule, RouterModule],
        providers: [{ provide: ReportsService, useValue: instance(mockReportsService) },
          StateService]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      resetCalls(mockReportsService);
      fixture = TestBed.createComponent(Bottom10UtilizedCircuitsComponent);
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
      component = new Bottom10UtilizedCircuitsComponent(null, instance(mockReportsService));
    });

    it('should call the report service on init', () => {
      // once on init
      component.ngOnInit();
      verify(mockReportsService.getBottom10UtilizedCircuits()).once();
    });
  })
});
