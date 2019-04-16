import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaViolationsComponent } from './sla-violations.component';
import { NumberCardComponent } from '../number-card/number-card.component';
import { AppWidgetLoadingComponent } from '../../../components';
import { StateService, CircuitService } from '../../../services';
import { Router } from '@angular/router';
import { mock, instance, when, verify, reset } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import { Circuit, SlaViolations } from '../../../../../models';

describe('SlaViolationsComponent', () => {
  let component: SlaViolationsComponent;
  let fixture: ComponentFixture<SlaViolationsComponent>;
  let mockCircuitService: CircuitService;

  beforeEach(() => {
    mockCircuitService = mock(CircuitService);
    when(mockCircuitService.getAllCircuits()).thenReturn(Observable.from([]));
  });

  describe('rendering', () => {
    beforeEach(async(() => {
      const mockRouter = mock(Router);
      TestBed.configureTestingModule({
        declarations: [SlaViolationsComponent, NumberCardComponent, AppWidgetLoadingComponent],
        providers: [StateService,
          { provide: Router, useValue: instance(mockRouter) },
          { provide: CircuitService, useValue: instance(mockCircuitService) }]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SlaViolationsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    beforeEach(() => {
      component = new SlaViolationsComponent(null, instance(mockCircuitService));
    });

    it('should get data on init', () => {
      component.ngOnInit();
      verify(mockCircuitService.getAllCircuits()).once();
    });

    it('should count all sla violations', () => {
      const mockCircuit1 = mock(Circuit);
      const mockCircuit2 = mock(Circuit);
      const violations1 = new SlaViolations();
      violations1.availability = <any> {isViolated: true};
      violations1.latency = <any> {isViolated: true};
      violations1.packetLoss = <any> {isViolated: true};
      violations1.jitter = <any> {isViolated: true};
      const violations2 = new SlaViolations();
      violations2.throughputSend = <any> {isViolated: true};
      violations2.throughputReceive = <any> {isViolated: true};
      violations2.latency = <any> {isViolated: true};
      violations2.availability = <any> {isViolated: true};
      when(mockCircuit1.slaViolations).thenReturn(violations1);
      when(mockCircuit2.slaViolations).thenReturn(violations2);
      when(mockCircuitService.getAllCircuits()).thenReturn(Observable.from([[instance(mockCircuit1), instance(mockCircuit2)]]));
      component.ngOnInit();

      expect(component.currentSlaViolations).toBe(8);
    });
  });

});
