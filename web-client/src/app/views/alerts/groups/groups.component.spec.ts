import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsComponent } from './groups.component';
import { AppNoDataComponent } from '../../../components/index';
import { AlertGroupsService, StateService } from '../../../services/index';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { BsModalService, ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Injector } from '@angular/core';
import { TableModule } from 'primeng/table';

describe('AlertGroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;
  const mockAlertGroupsService = mock(AlertGroupsService);
  when(mockAlertGroupsService.getAll()).thenReturn(Observable.from([]));
  const mockRouter = mock(Router);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupsComponent, AppNoDataComponent],
      imports: [TableModule, FormsModule],
      providers: [
        { provide: AlertGroupsService, useValue: instance(mockAlertGroupsService) },
        { provide: Router, useValue: instance(mockRouter) },
        { provide: Injector, useValue: null },
        BsModalService,
        ComponentLoaderFactory,
        PositioningService,
        StateService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
