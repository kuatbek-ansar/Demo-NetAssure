import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Bottom10UtilizedInterfacesComponent } from './bottom10-utilized-interfaces.component';
import { mock, instance, when, verify, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../../rxjs-imports';
import { ReportsService, StateService } from '../../../services';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';

describe('Bottom10UtilizedInterfacesComponent', () => {
  let component: Bottom10UtilizedInterfacesComponent;
  let fixture: ComponentFixture<Bottom10UtilizedInterfacesComponent>;
  let mockReportsService: ReportsService;

  beforeEach(() => {
    mockReportsService = mock(ReportsService);
    when(mockReportsService.getBottom10UtilizedInterfaces()).thenReturn(Observable.from([]));
  });

  describe('rendering', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [Bottom10UtilizedInterfacesComponent, AppWidgetLoadingComponent],
        imports: [TableModule, RouterModule],
        providers: [{ provide: ReportsService, useValue: instance(mockReportsService) },
          StateService]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      resetCalls(mockReportsService);
      fixture = TestBed.createComponent(Bottom10UtilizedInterfacesComponent);
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
      component = new Bottom10UtilizedInterfacesComponent(null, instance(mockReportsService));
    });

    it('should call the report service on init', () => {
      // once on init
      component.ngOnInit();
      verify(mockReportsService.getBottom10UtilizedInterfaces()).once();
    });
  });
});
