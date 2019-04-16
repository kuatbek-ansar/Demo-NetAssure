import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceGroupSelectorComponent } from './invoice-group-selector.component';
import { AppWidgetLoadingComponent } from '../../../components/app-widget-loading/app-widget-loading.component'
import { FormsModule } from '@angular/forms';
import { Injector } from '@angular/core';
import { instance, mock, when, verify } from 'ts-mockito/lib/ts-mockito';
import { InvoiceService } from '../../../services/index';
import { StateService } from '../../../services/index';
import { Observable } from 'rxjs/Observable';
import { EventEmitter } from '@angular/core';


describe('InvoiceGroupSelectorComponent', () => {
  let component: InvoiceGroupSelectorComponent;
  let fixture: ComponentFixture<InvoiceGroupSelectorComponent>;
  const mockInvoiceService = mock(InvoiceService);
  when(mockInvoiceService.getGroupsWithPostalCodes()).thenReturn(Observable.from([]));

  describe('rendering', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [InvoiceGroupSelectorComponent, AppWidgetLoadingComponent],
        providers: [{ provide: InvoiceService, useValue: instance(mockInvoiceService) },
                    StateService,
                    Injector],
        imports: [FormsModule]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(InvoiceGroupSelectorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('behaviour', () => {

    beforeEach(() => {
      component = new InvoiceGroupSelectorComponent(instance(mockInvoiceService), null);
    });

    it('should fire event correctly', () => {
      let calledGroup = null;
      component.onChange = new EventEmitter(false);
      component.onChange.subscribe((grp) => { calledGroup = grp; });
      component.rows = [{ groupId: '1', name: 'Santa Inc.', postalCode: 'H0H 0H0' }]; // real data
      component.value = '1';
      component.onGroupChange();

      expect(calledGroup).toBeTruthy();
      expect(calledGroup).toBe(component.rows[0]);
    });

    it('should call invoice service on init', () => {
      component.ngOnInit();
      verify(mockInvoiceService.getGroupsWithPostalCodes()).called();
    });
  });

});
