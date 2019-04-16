import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceMonitoringCostsComponent } from './invoice-monitoring-costs.component';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { Injector } from '@angular/core';
import { StateService, BillableDeviceService } from '../../../services';
import { StateServiceProvider } from '../../../helpers/state-service-provider';

describe('InvoiceMonitoringCostsComponent', () => {
  let component: InvoiceMonitoringCostsComponent;
  let fixture: ComponentFixture<InvoiceMonitoringCostsComponent>;

  const mockBillableDeviceService = mock(BillableDeviceService);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceMonitoringCostsComponent],
      providers: [{ provide: BillableDeviceService, useValue: instance(mockBillableDeviceService) },
      { provide: Injector, useValue: null },
      { provide: StateService, useValue: new StateServiceProvider().default()}]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceMonitoringCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
