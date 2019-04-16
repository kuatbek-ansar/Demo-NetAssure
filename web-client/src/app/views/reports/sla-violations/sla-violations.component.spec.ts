import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaViolationsComponent } from './sla-violations.component';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RouterModule } from '@angular/router';
import { AppWidgetLoadingComponent } from '../../../components';
import { ReportsService, StateService } from '../../../services';
import { when, mock, instance, resetCalls, verify } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import { Circuit, SlaViolations } from '../../../../../models';

describe('SlaBreakoutComponent', () => {
  let component: SlaViolationsComponent;
  let mockReportsService: ReportsService;

  beforeEach(() => {
    mockReportsService = mock(ReportsService);
    when(mockReportsService.getCircuits()).thenReturn(Observable.from([[]]));
  });

  describe('rendering', () => {
    let fixture: ComponentFixture<SlaViolationsComponent>;


    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [SlaViolationsComponent, AppWidgetLoadingComponent],
        imports: [TableModule, TooltipModule, RouterModule],
        providers: [
          { provide: ReportsService, useValue: instance(mockReportsService) },
          StateService]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      resetCalls(mockReportsService);
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
      resetCalls(mockReportsService);
      component = new SlaViolationsComponent(null, instance(mockReportsService));
    });

    it('should call the report service on init', () => {
      // once on init
      component.ngOnInit();
      verify(mockReportsService.getCircuits()).once();
    });

    it('should return 0 for total sla violations when there are no violations', () => {
      component.ngOnInit();
      expect(component.totalSlaViolations).toBe(0);
      expect(component.totalAvailabilityViolations).toBe(0);
      expect(component.totalJitterViolations).toBe(0);
      expect(component.totalLatencyViolations).toBe(0);
      expect(component.totalPacketLossViolations).toBe(0);
      expect(component.totalThroughputViolations).toBe(0);
    });

    it('should calculate total sla violations', () => {
      const mockCircuit1 = mock(Circuit);

      when(mockCircuit1.slaViolations).thenReturn(<SlaViolations>
        {
          availability: {
            isViolated: true
          },
          latency: {
            isViolated: true
          },
          packetLoss: {
            isViolated: false
          },
          jitter: {
            isViolated: false
          },
          throughputSend: {
            isViolated: false
          },
          throughputReceive: {
            isViolated: true
          },
          total: 4
        });

      const mockCircuit2 = mock(Circuit);
      when(mockCircuit2.slaViolations).thenReturn(<any>
        {
          availability: {
            isViolated: false
          },
          latency: {
            isViolated: false
          },
          packetLoss: {
            isViolated: true
          },
          jitter: {
            isViolated: true
          },
          throughputSend: {
            isViolated: true
          },
          throughputReceive: {
            isViolated: true
          },
          total: 3
        });

      when(mockReportsService.getCircuits()).thenReturn(Observable.from([[instance(mockCircuit1), instance(mockCircuit2)]]))

      component.ngOnInit();
      expect(component.totalSlaViolations).toBe(7);
      expect(component.totalAvailabilityViolations).toBe(1);
      expect(component.totalJitterViolations).toBe(1);
      expect(component.totalLatencyViolations).toBe(1);
      expect(component.totalPacketLossViolations).toBe(1);
      expect(component.totalThroughputViolations).toBe(3);
    });
  });
});
