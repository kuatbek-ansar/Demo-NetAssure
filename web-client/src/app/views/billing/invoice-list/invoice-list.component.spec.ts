import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceListComponent } from './invoice-list.component';
import { InvoiceService, StateService } from '../../../services/index';
import { instance, mock, when, verify, anything } from 'ts-mockito/lib/ts-mockito';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Injector} from '@angular/core';
import { TableModule } from 'primeng/table';
import { AppNoDataComponent } from '../../../components/index';
import { Observable } from 'rxjs/Observable';
import { arrayMatches } from '../../../helpers/array-matcher';
import { StateServiceProvider } from '../../../helpers/state-service-provider';
import { exec } from 'child_process';

describe('InvoiceListComponent', () => {

  const mockInvoiceService = mock(InvoiceService);
  const mockRouter = mock(Router);
  when(mockInvoiceService.getAll()).thenReturn(Observable.from([[
    { 'id': 1, customerId: '22', 'date': '2018-01-31T07:00:00.000Z', 'number': '111', 'amount': 2480 }
  ]]));
  when(mockInvoiceService.getByGroupId('17')).thenReturn(Observable.from([]));
  when(mockInvoiceService.getGroupsWithPostalCodes()).thenReturn(Observable.from([
    { 'groupId': '22', 'name': 'test group'}
  ]));

  describe('rendering', () => {
    let component: InvoiceListComponent;
    let fixture: ComponentFixture<InvoiceListComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [InvoiceListComponent, AppNoDataComponent],
        providers: [
          { provide: InvoiceService, useValue: instance(mockInvoiceService) },
          { provide: Router, useValue: instance(mockRouter) },
          { provide: Injector, useValue: null },
          { provide: StateService, useValue: new StateServiceProvider().default() }],
        imports: [TableModule, FormsModule]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(InvoiceListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('behaviour', () => {

    it('should navigate to create', () => {
      const component = new InvoiceListComponent(null, instance(mockInvoiceService), instance(mockRouter));
      component.create();
      verify(mockRouter.navigate(arrayMatches(['/admin/billing/create']))).called();
    });

    it('should navigate to view', () => {
      const component = new InvoiceListComponent(null, instance(mockInvoiceService), instance(mockRouter));
      component.view({id: 7});
      verify(mockRouter.navigate(arrayMatches(['/admin/billing/view', 7]))).called();
    });

    it('should get all invoices on init', () => {
      const component = new InvoiceListComponent(null, instance(mockInvoiceService), instance(mockRouter));
      component.ngOnInit();
      verify(mockInvoiceService.getAll()).called();
      expect(component.model.length).toBe(1);
      expect(component.model[0].id).toBe(1);
    });

    it('should poupulate groups filter on init', () => {
      const component = new InvoiceListComponent(null, instance(mockInvoiceService), instance(mockRouter));
      component.ngOnInit();
      verify(mockInvoiceService.getGroupsWithPostalCodes()).called();
      expect(component.groups.length).toBe(2);
      expect(component.groups[0].groupId).toBe('');
      expect(component.groups[1].groupId).toBe('22');
    });

    it('should refresh grid on group filter changed', () => {
      const component = new InvoiceListComponent(null, instance(mockInvoiceService), instance(mockRouter));
      component.filterByGroupId = '17';
      component.onGroupChange();
      verify(mockInvoiceService.getByGroupId('17')).called();
      expect(component.model.length).toBe(0);
    });
  });

  it('should generate pdf', () => {
    const component = new InvoiceListComponent(null, instance(mockInvoiceService), instance(mockRouter));
    when(mockInvoiceService.download(anything())).thenReturn(Observable.from([]));
    component.download({id: 7});
    verify(mockInvoiceService.download('7')).called();
  });
});
