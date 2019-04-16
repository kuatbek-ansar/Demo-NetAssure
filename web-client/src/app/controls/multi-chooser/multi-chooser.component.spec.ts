import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiChooserComponent } from './multi-chooser.component';
import { FormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { mock, instance } from 'ts-mockito/lib/ts-mockito';

describe('MultiChooserComponent', () => {
  let component: MultiChooserComponent;
  let fixture: ComponentFixture<MultiChooserComponent>;

  const mockBsModalServiceService = mock(BsModalService);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiChooserComponent],
      imports: [FormsModule],
      providers: [{ provide: BsModalService, useValue: instance(mockBsModalServiceService) }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
