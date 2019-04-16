import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueScoreComponent } from './value-score.component';
import { StateService, CircuitService } from '../../../services';
import { NumberCardComponent } from '../number-card/number-card.component';
import { AppWidgetLoadingComponent } from '../../../components';
import { mock, instance, when } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

describe('ValueScoreComponent', () => {
  let component: ValueScoreComponent;
  let fixture: ComponentFixture<ValueScoreComponent>;

  beforeEach(async(() => {
    const mockCircuitService = mock(CircuitService);
    const mockRouter = mock(Router);
    when(mockCircuitService.getAllCircuits()).thenReturn(Observable.from([]));
    TestBed.configureTestingModule({
      declarations: [ValueScoreComponent, NumberCardComponent, AppWidgetLoadingComponent],
      providers: [StateService,
        { provide: CircuitService, useValue: instance(mockCircuitService)},
        { provide: Router, useValue: instance(mockRouter)}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
