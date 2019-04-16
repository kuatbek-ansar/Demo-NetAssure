import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceViewComponent } from './invoice-view.component';
import { InvoiceService, StateService } from '../../../services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { mock, instance } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import { Injector } from '@angular/core';
import { StateServiceProvider } from '../../../helpers/state-service-provider';

describe('InvoiceViewComponent', () => {
  let component: InvoiceViewComponent;
  let fixture: ComponentFixture<InvoiceViewComponent>;
  const mockInvoiceService = mock(InvoiceService);
  const mockRouter = mock(Router);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceViewComponent],
      providers: [
        { provide: InvoiceService, useValue: instance(mockInvoiceService) },
        { provide: Router, useValue: instance(mockRouter) },
        { provide: ActivatedRoute, useValue: { params: Observable.from([]) } },
        { provide: StateService, useValue: new StateServiceProvider().default() },
        { provide: Injector, useValue: null }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('InvoiceViewComponent', () => {
  it('should total invoice properly', () => {
    const sut = new InvoiceViewComponent(null, null, null, null);
    sut.model = {
      lineItems: [
        { price: 10, quantity: 2 },
        { price: 11, quantity: 3 },
      ]
    };
    expect(sut.total()).toBe(53);
  });
});
