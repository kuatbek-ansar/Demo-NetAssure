import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiEditComponent } from './multi-edit.component';
import { FormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { BsModalRef } from 'ngx-bootstrap';

describe('MultiEditComponent', () => {
  let component: MultiEditComponent;
  let fixture: ComponentFixture<MultiEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiEditComponent],
      imports: [FormsModule],
      providers: [BsModalService, BsModalRef]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
