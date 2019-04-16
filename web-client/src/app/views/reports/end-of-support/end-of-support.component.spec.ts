import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndOfSupportComponent } from './end-of-support.component';
import { mock, instance, when, verify, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../../rxjs-imports';
import { ReportsService, StateService } from '../../../services';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';

describe('EndOfSupportComponent', () => {
  let component: EndOfSupportComponent;
  let fixture: ComponentFixture<EndOfSupportComponent>;
  let mockReportsService: ReportsService;

  beforeEach(() => {
    mockReportsService = mock(ReportsService);
    when(mockReportsService.getEndOfSupport()).thenReturn(Observable.from([]));
  });

  describe('rendering', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ EndOfSupportComponent , AppWidgetLoadingComponent],
        imports: [TableModule, RouterModule],
        providers: [{ provide: ReportsService, useValue: instance(mockReportsService) },
          StateService]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      resetCalls(mockReportsService);
      fixture = TestBed.createComponent(EndOfSupportComponent);
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
      component = new EndOfSupportComponent(null, instance(mockReportsService));
    });

    it('should call the report service on init', () => {
      // once on init
      component.ngOnInit();
      verify(mockReportsService.getEndOfSupport()).once();
    });
  });

});
