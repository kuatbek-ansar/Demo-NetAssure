import { Component, OnInit, Injector } from '@angular/core';
import { WidgetComponent } from '../../../containers';
import { Circuit } from '../../../../../models';
import { ReportsService } from '../../../services';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'sla-violations',
  templateUrl: './sla-violations.component.html',
  styleUrls: ['./sla-violations.component.scss']
})
export class SlaViolationsComponent extends WidgetComponent implements OnInit {
  public model: Circuit[];
  public totalSlaViolations: number;
  public totalAvailabilityViolations: number;
  public totalPacketLossViolations: number;
  public totalLatencyViolations: number;
  public totalThroughputViolations: number;
  public totalJitterViolations: number;
  public cols: Array<any>;

  constructor(
    private injector: Injector,
    private reportsService: ReportsService) {
    super(injector);
    this.cols = [
      { field: 'name', header: 'circuit' },
      { field: 'slaViolations.total', header: 'Violations' },
      { field: 'slaViolations.availability.isViolated', header: 'Availability' },
      { field: 'slaViolations.packetLoss.isViolated', header: 'Packet Loss' },
      { field: 'slaViolations.latency.isViolated', header: 'Latency' },
      { field: 'slaViolations.throughputSend.isViolated', header: 'Send Throughput' },
      { field: 'slaViolations.throughputReceive.isViolated', header: 'Receive Throughput' },
      { field: 'slaViolations.jitter.isViolated', header: 'Jitter' }
    ];
  }

  ngOnInit() {
    this.getData();
  }

  private getData(): void {
    this.Working();
    this.reportsService.getCircuits().subscribe(x => {
      this.model = x;
      this.calculateTotalViolations();
      this.Ready();
    });
  }

  private calculateTotalViolations() {
    this.totalSlaViolations = this.model.reduce((sum, circuit) => sum + circuit.slaViolations.total, 0);
    this.totalAvailabilityViolations = this.model.reduce((sum, circuit) =>
      sum + (circuit.slaViolations.availability.isViolated ? 1 : 0), 0);

    this.totalThroughputViolations = this.model.reduce((sum, circuit) =>
      sum
      + (circuit.slaViolations.throughputSend.isViolated ? 1 : 0)
      + (circuit.slaViolations.throughputReceive.isViolated ? 1 : 0)
      , 0);

    this.totalJitterViolations = this.model.reduce((sum, circuit) =>
      sum + (circuit.slaViolations.jitter.isViolated ? 1 : 0), 0);

    this.totalPacketLossViolations = this.model.reduce((sum, circuit) =>
      sum + (circuit.slaViolations.packetLoss.isViolated ? 1 : 0), 0);

    this.totalLatencyViolations = this.model.reduce((sum, circuit) =>
      sum + (circuit.slaViolations.latency.isViolated ? 1 : 0), 0);

  }

}
