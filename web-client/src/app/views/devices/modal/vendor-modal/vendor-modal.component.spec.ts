import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorNgModalComponent } from './vendor-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService, VendorService } from '../../../../services';
import { mock, instance, when } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../../../rxjs-imports';

describe('VendorModalComponent', () => {
  let component: VendorNgModalComponent;
  let fixture: ComponentFixture<VendorNgModalComponent>;

  beforeEach(async(() => {
    const mockVendorService = mock(VendorService);
    when(mockVendorService.get()).thenReturn(Observable.from([]));
    TestBed.configureTestingModule({
      declarations: [ VendorNgModalComponent ],
      providers: [NgbActiveModal, StateService, {provide: VendorService, useValue: instance(mockVendorService)}],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorNgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
