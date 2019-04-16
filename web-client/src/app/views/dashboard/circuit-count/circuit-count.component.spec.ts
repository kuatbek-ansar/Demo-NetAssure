import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitCountComponent } from './circuit-count.component';
import { NumberCardComponent } from '../number-card/number-card.component';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { CircuitService } from '../../../services/index';
import { Injector } from '@angular/core';
import { StateService } from '../../../services/state.service';
import { mock, instance, when } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../../rxjs-imports';
import { Router } from '@angular/router';

describe('CircuitCountComponent', () => {
  let component: CircuitCountComponent;
  let fixture: ComponentFixture<CircuitCountComponent>;

  beforeEach(async(() => {
    const mockCircuitService = mock(CircuitService);
    const mockRouter = mock(Router);
    when(mockCircuitService.getCount()).thenReturn(Observable.from([]));
    TestBed.configureTestingModule({
      declarations: [CircuitCountComponent, NumberCardComponent, AppWidgetLoadingComponent],
      providers: [{ provide: CircuitService, useValue: instance(mockCircuitService) },
      { provide: Injector, useValue: null },
      { provide: Router, useValue: instance(mockRouter)},
        StateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircuitCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
