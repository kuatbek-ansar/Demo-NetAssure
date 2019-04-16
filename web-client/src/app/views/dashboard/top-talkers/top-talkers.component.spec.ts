import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTalkersComponent } from './top-talkers.component';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { ChartsModule } from 'ng2-charts';
import { ReportsService } from '../../../services/index';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { StateService } from '../../../services/state.service';
import { Observable } from 'rxjs/Observable';

describe('TopTalkersComponent', () => {
  let component: TopTalkersComponent;
  let fixture: ComponentFixture<TopTalkersComponent>;

  beforeEach(async(() => {
    const mockReportsService = mock(ReportsService);
    when(mockReportsService.getTopTalkers()).thenReturn(Observable.from([]));
    TestBed.configureTestingModule({
      declarations: [TopTalkersComponent, AppWidgetLoadingComponent],
      imports: [ChartsModule],
      providers: [{ provide: ReportsService, useValue: instance(mockReportsService) },
        StateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopTalkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
