import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceApplianceCostsComponent } from './invoice-appliance-costs.component';
import { ProxyService, StateService } from '../../../services';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { Injector } from '@angular/core';
import { StateServiceProvider } from '../../../helpers/state-service-provider';

describe('InvoiceApplianceCostsComponent', () => {
  let component: InvoiceApplianceCostsComponent;
  let fixture: ComponentFixture<InvoiceApplianceCostsComponent>;
  const mockProxyService = mock(ProxyService);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceApplianceCostsComponent],
      providers: [
        { provide: ProxyService, useValue: instance(mockProxyService) },
        { provide: Injector, useValue: null },
        { provide: StateService, useValue: new StateServiceProvider().default() }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceApplianceCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
