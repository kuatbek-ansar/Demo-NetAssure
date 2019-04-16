import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagedDevicesCountComponent } from './managed-devices-count.component';
import { NumberCardComponent } from '../number-card/number-card.component';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { ManagedDeviceService } from '../../../services/index';
import { mock, instance, when } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../../rxjs-imports';
import { Injector } from '@angular/core';
import { StateService } from '../../../services/state.service';
import { Router } from '@angular/router';

describe('ManagedDevicesCountComponent', () => {
  let component: ManagedDevicesCountComponent;
  let fixture: ComponentFixture<ManagedDevicesCountComponent>;

  beforeEach(async(() => {
    const mockManagedDeviceService = mock(ManagedDeviceService);
    const mockRouter = mock(Router);
    when(mockManagedDeviceService.getCount()).thenReturn(Observable.from([]));
    TestBed.configureTestingModule({
      declarations: [ ManagedDevicesCountComponent, NumberCardComponent, AppWidgetLoadingComponent],
      providers: [{ provide: ManagedDeviceService, useValue: instance(mockManagedDeviceService) },
        { provide: Injector, useValue: null },
        { provide: Router, useValue: instance(mockRouter)},
          StateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagedDevicesCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
