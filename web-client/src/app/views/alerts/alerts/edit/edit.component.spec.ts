import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertEditComponent } from './edit.component';
import { FormsModule } from '@angular/forms';
import { MultiChooserComponent } from '../../../../controls/index';
import { AlertsService, DeviceViewService, AlertGroupsService, StateService, NotificationTypeService } from '../../../../services/index';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader/component-loader.factory';
import { PositioningService } from 'ngx-bootstrap/positioning/positioning.service';
import { Observable } from 'rxjs/Observable';
import { Injector } from '@angular/core';

describe('AlertEditComponent', () => {
  let component: AlertEditComponent;
  let fixture: ComponentFixture<AlertEditComponent>;

  const mockAlertsService = mock(AlertsService);
  when(mockAlertsService.getOne(1)).thenReturn(Observable.from([]));
  const mockDeviceViewService = mock(DeviceViewService);
  when(mockDeviceViewService.getDevices(17)).thenReturn(Observable.from([]));
  const mockAlertGroupsService = mock(AlertGroupsService);
  when(mockAlertGroupsService.getAll()).thenReturn(Observable.from([]));
  const mockRouter = mock(Router);
  const mockActivatedRoute = {
    params: Observable.from([{ id: 1 }])
  };
  const mockNotificationTypeService = mock(NotificationTypeService);
  when(mockNotificationTypeService.getAll()).thenReturn(Observable.from([]));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertEditComponent, MultiChooserComponent],
      imports: [FormsModule],
      providers: [
        { provide: AlertsService, useValue: instance(mockAlertsService) },
        { provide: DeviceViewService, useValue: instance(mockDeviceViewService) },
        { provide: AlertGroupsService, useValue: instance(mockAlertGroupsService) },
        { provide: Router, useValue: instance(mockRouter) },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NotificationTypeService, useValue: instance(mockNotificationTypeService) },
        { provide: Injector, useValue: null },
        {
          provide: StateService, useValue: {
            User: {
              Account: { GroupId: 17 }
            },
            Loading$: Observable.from([]),
            AccountStateChanged$: Observable.from([]),
            Working: () => { },
            Ready: () => { }
          }
        },
        BsModalService,
        ComponentLoaderFactory,
        PositioningService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
