import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceListComponent } from './interface-list.component';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { CircuitService } from '../../../services/index';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { VendorService } from '../../../services/vendor.service';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap';
import { StateService } from '../../../services/state.service';
import { Observable } from 'rxjs/Observable';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { Injector } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';

describe('InterfaceListComponent', () => {
  let component: InterfaceListComponent;
  let fixture: ComponentFixture<InterfaceListComponent>;

  beforeEach(async(() => {
    const mockCircuitService = mock(CircuitService);
    const mockVendorService = mock(VendorService);
    when(mockVendorService.get()).thenReturn(Observable.from([]));
    const mockToasterService = mock(ToasterService);
    const mockBsModalServiceService = mock(BsModalService);
    TestBed.configureTestingModule({
      declarations: [InterfaceListComponent, AppWidgetLoadingComponent],
      imports: [TableModule,
        FormsModule,
        TextMaskModule,
        DropdownModule,
        RouterModule,
        BrowserAnimationsModule],
      providers: [{ provide: CircuitService, useValue: instance(mockCircuitService) },
      { provide: VendorService, useValue: instance(mockVendorService) },
      { provide: ToasterService, useValue: instance(mockToasterService) },
      { provide: BsModalService, useValue: instance(mockBsModalServiceService) },
      { provide: Injector, useValue: null },
        StateService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('input masking', () => {
  let component: InterfaceListComponent;
  beforeEach(() => {
    component = new InterfaceListComponent(null, null, null, null, null);
  });
  it('should handle an empty ip', () => {
    const expression = component.ipAddressMask('', { currentCaretPosition: 0 });
    expect(expression.length).toBe(15);
  });

  it('should match a full ip', () => {
    const expression = component.ipAddressMask('', { currentCaretPosition: 0 });
    const regex = new RegExp(expression.join('').replace(/\//g, ''));
    expect(regex.test('123.123.123.123')).toBeTruthy();
  });

  it('should match a short first octet', () => {
    const expression = component.ipAddressMask('1.', { currentCaretPosition: 0 });
    const regex = new RegExp(expression.join('').replace(/\//g, ''));
    expect(regex.test('1.123.123.123')).toBeTruthy();
  });
});
