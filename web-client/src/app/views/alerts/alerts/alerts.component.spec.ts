import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsComponent } from './alerts.component';
import { AppNoDataComponent } from '../../../components/index';
import { DropdownModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AlertsService, StateService } from '../../../services/index';
import { instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { Router } from '@angular/router';
import { ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

describe('AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;
  const mockAlertsService = mock(AlertsService);
  when(mockAlertsService.getAll()).thenReturn(Observable.from([]));
  const mockRouter = mock(Router);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertsComponent, AppNoDataComponent],
      imports: [TableModule,
        DropdownModule,
        BrowserAnimationsModule,
        FormsModule],
      providers: [
        { provide: AlertsService, useValue: instance(mockAlertsService) },
        { provide: Router, useValue: instance(mockRouter) },
        { provide: Injector, useValue: null },
        BsModalService,
        StateService,
        ComponentLoaderFactory,
        PositioningService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
