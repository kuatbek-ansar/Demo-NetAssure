import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagedDevicesHistoryComponent } from './managed-devices-history.component';
import { mock, instance, when } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../../rxjs-imports';
import { ReportsService, StateService } from '../../../services';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';

describe('ManagedDevicesHistoryComponent', () => {
  let component: ManagedDevicesHistoryComponent;
  let fixture: ComponentFixture<ManagedDevicesHistoryComponent>;

  beforeEach(async(() => {
    const mockReportsService = mock(ReportsService);
    when(mockReportsService.getManagedDevices()).thenReturn(Observable.from([]));
    TestBed.configureTestingModule({
      declarations: [ ManagedDevicesHistoryComponent , AppWidgetLoadingComponent],
      imports: [TableModule, RouterModule],
      providers: [{ provide: ReportsService, useValue: instance(mockReportsService) },
        StateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagedDevicesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
