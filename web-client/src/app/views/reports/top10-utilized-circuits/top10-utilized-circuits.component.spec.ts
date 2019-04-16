import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Top10UtilizedCircuitsComponent } from './top10-utilized-circuits.component';
import { mock, instance, when, verify, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../../rxjs-imports';
import { ReportsService, StateService } from '../../../services';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';

describe('Top10UtilizedCircuitsComponent', () => {
  let component: Top10UtilizedCircuitsComponent;
  let fixture: ComponentFixture<Top10UtilizedCircuitsComponent>;
  let mockReportsService: ReportsService;

  beforeEach(() => {
    mockReportsService = mock(ReportsService);
    when(mockReportsService.getTop10UtilizedCircuits()).thenReturn(Observable.from([]));
  });

  describe('rendering', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [Top10UtilizedCircuitsComponent, AppWidgetLoadingComponent],
        imports: [TableModule, RouterModule],
        providers: [{ provide: ReportsService, useValue: instance(mockReportsService) },
          StateService]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      resetCalls(mockReportsService);
      fixture = TestBed.createComponent(Top10UtilizedCircuitsComponent);
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
      component = new Top10UtilizedCircuitsComponent(null, instance(mockReportsService));
    });

    it('should call the report service on init', () => {
      // once on init
      component.ngOnInit();
      verify(mockReportsService.getTop10UtilizedCircuits()).once();
    });
  });

});
