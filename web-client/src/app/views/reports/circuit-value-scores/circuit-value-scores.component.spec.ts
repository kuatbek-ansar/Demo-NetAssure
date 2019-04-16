import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitValueScoresComponent } from './circuit-value-scores.component';
import { mock, instance, when, verify, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import '../../../../rxjs-imports';
import { ReportsService, StateService } from '../../../services';
import { AppWidgetLoadingComponent } from '../../../components/index';
import { RouterModule } from '@angular/router';
import { Circuit, ValueScoreMetrics } from '../../../../../models';
import { TableModule } from 'primeng/table';

describe('Circuit Value Scores', () => {
  let component: CircuitValueScoresComponent;
  let fixture: ComponentFixture<CircuitValueScoresComponent>;
  let mockReportsService: ReportsService;

  beforeEach(() => {
    mockReportsService = mock(ReportsService);
    when(mockReportsService.getCircuits()).thenReturn(Observable.from([]));
  });

  describe('rendering', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [CircuitValueScoresComponent, AppWidgetLoadingComponent],
        imports: [TableModule, RouterModule],
        providers: [{ provide: ReportsService, useValue: instance(mockReportsService) },
          StateService]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      resetCalls(mockReportsService);
      fixture = TestBed.createComponent(CircuitValueScoresComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    beforeEach(() => {
      resetCalls(mockReportsService);
      component = new CircuitValueScoresComponent(null, instance(mockReportsService));
    });

    it('should call the report service on init', () => {
      // once on init
      component.ngOnInit();
      verify(mockReportsService.getCircuits()).once();
    });

    it('should return average score 0 when no circuits', () => {
      component.ngOnInit();
      expect(component.averageValueScore()).toBe(0);
    });

    it('should return average score', () => {
      const mockCircuit1 = mock(Circuit);
      const mockCircuit2 = mock(Circuit);
      when(mockCircuit1.valueScore).thenReturn(100);
      when(mockCircuit1.valueMetrics).thenReturn(<any>{});
      when(mockCircuit2.valueScore).thenReturn(50);
      when(mockCircuit2.valueMetrics).thenReturn(<any>{});
      when(mockReportsService.getCircuits()).thenReturn(Observable.from([[instance(mockCircuit1), instance(mockCircuit2)]]));
      component.ngOnInit();
      expect(component.averageValueScore()).toBe(75);
    });

    it('should calculate average metrics on load', () => {
      const mockCircuit1 = mock(Circuit);
      const mockCircuit2 = mock(Circuit);
      when(mockCircuit1.valueMetrics).thenReturn(<ValueScoreMetrics>{
        market: 10,
        packetLoss: 20,
        latency: 30,
        uptime: 40,
        utilizationSend: 50,
        utilizationReceive: 80
      });
      when(mockCircuit2.valueMetrics).thenReturn({
        market: 110,
        packetLoss: 220,
        latency: 330,
        uptime: 440,
        utilizationSend: 550,
        utilizationReceive: 120
      });
      when(mockReportsService.getCircuits()).thenReturn(Observable.from([[instance(mockCircuit1), instance(mockCircuit2)]]));
      component.ngOnInit();

      expect(component.averageMetrics.market).toBe(60);
      expect(component.averageMetrics.packetLoss).toBe(120);
      expect(component.averageMetrics.latency).toBe(180);
      expect(component.averageMetrics.uptime).toBe(240);
      expect(component.averageMetrics.utilizationSend).toBe(300);
      expect(component.averageMetrics.utilizationReceive).toBe(100);
    });
  });

});
