import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Layer7Component } from './layer7.component';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ReportsService, StateService } from '../../../services/index';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';

describe('Layer7Component', () => {
  let component: Layer7Component;
  let fixture: ComponentFixture<Layer7Component>;

  beforeEach(async(() => {
    const mockReportsService = mock(ReportsService);
    when(mockReportsService.getLayer7()).thenReturn(Observable.from([]))
    TestBed.configureTestingModule({
      declarations: [Layer7Component, AppWidgetLoadingComponent],
      imports: [ChartsModule],
      providers: [{ provide: ReportsService, useValue: instance(mockReportsService) },
        StateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Layer7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
