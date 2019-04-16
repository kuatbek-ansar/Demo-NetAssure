import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { Injector } from '@angular/core';
import { MockComponent } from 'mock-component';

import { CalendarModule } from 'primeng/primeng';

import { InvoiceApplianceCostsComponent } from '../invoice-appliance-costs/invoice-appliance-costs.component';
import { InvoiceCreationComponent } from './invoice-creation.component';
import { InvoiceGroupSelectorComponent } from '../invoice-group-selector/invoice-group-selector.component';
import { InvoiceMonitoringCostsComponent } from '../invoice-monitoring-costs/invoice-monitoring-costs.component';
import { StateService, InvoiceService } from '../../../services';
import { StateServiceProvider } from '../../../helpers/state-service-provider';
import { mock, instance } from 'ts-mockito/lib/ts-mockito';
import { Router } from '@angular/router';

describe('InvoiceCreationComponent', () => {
  let component: InvoiceCreationComponent;
  let fixture: ComponentFixture<InvoiceCreationComponent>;

  const mockInvoiceService = mock(InvoiceService);
  const mockRouter = mock(Router);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceCreationComponent,
        MockComponent(InvoiceApplianceCostsComponent),
        MockComponent(InvoiceMonitoringCostsComponent),
        MockComponent(InvoiceGroupSelectorComponent)],
      imports: [CalendarModule,
        FormsModule,
        BrowserAnimationsModule],
      providers: [{ provide: Injector, useValue: null },
      { provide: InvoiceService, useValue: instance(mockInvoiceService) },
      { provide: Router, useValue: instance(mockRouter) },
      { provide: StateService, useValue: new StateServiceProvider().default() }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should Create', () => {
    expect(component).toBeTruthy();
  });
});
