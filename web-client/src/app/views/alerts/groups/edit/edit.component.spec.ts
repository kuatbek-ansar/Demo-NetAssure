import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEditComponent } from './edit.component';
import { FormsModule } from '@angular/forms';
import { AlertGroupsService } from '../../../../services/alert-groups.service';
import { instance, mock, when, anything } from 'ts-mockito/lib/ts-mockito';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { StateService } from '../../../../services/index';
import { Observable } from 'rxjs/Observable';
import { Injector } from '@angular/core';

describe('GroupEditComponent', () => {
  let component: GroupEditComponent;
  let fixture: ComponentFixture<GroupEditComponent>;
  const mockAlertGroupsService = mock(AlertGroupsService);
  when(mockAlertGroupsService.getOne(anything())).thenReturn(Observable.from([]));
  const mockToasterService = mock(ToasterService);
  const mockRouter = mock(Router);
  const mockActivatedRoute = {
    params: Observable.from([{ id: 1 }])
  };
  const mockBsModalService = mock(BsModalService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupEditComponent],
      imports: [FormsModule],
      providers: [{ provide: AlertGroupsService, useValue: instance(mockAlertGroupsService) },
      { provide: ToasterService, useValue: instance(mockToasterService) },
      { provide: Router, useValue: instance(mockRouter) },
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
      { provide: BsModalService, useValue: instance(mockBsModalService) },
      { provide: Injector, useValue: null },
        StateService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
