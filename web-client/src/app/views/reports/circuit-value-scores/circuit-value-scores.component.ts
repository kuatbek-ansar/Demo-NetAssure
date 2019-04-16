import { Component, Injector, OnInit } from '@angular/core';

import { ReportsService } from '../../../services';
import { Utilization } from '../../../models/zabbix';
import { WidgetComponent } from '../../../containers';
import { Circuit, ValueScoreMetrics } from '../../../../../models';
@Component({
  selector: 'circuit-value-scores',
  templateUrl: 'circuit-value-scores.component.html',
  styleUrls: [
    './circuit-value-scores.component.scss'
  ]
})

export class CircuitValueScoresComponent extends WidgetComponent implements OnInit {
  public model: Circuit[];
  public cols: Array<any>;
  public averageMetrics: ValueScoreMetrics;

  constructor(
    private injector: Injector,
    private reportsService: ReportsService
  ) {
    super(injector);
    this.cols = [
      { field: 'name', header: 'Circuit' },
      { field: 'valueScore', header: 'Score' },
      { field: 'valueMetrics.market', header: 'Market' },
      { field: 'valueMetrics.packetLoss', header: 'Packet Loss' },
      { field: 'valueMetrics.latency', header: 'Latency' },
      { field: 'valueMetrics.uptime', header: 'Uptime' },
      { field: 'valueMetrics.UtilizationSend', header: 'Send Utilization' },
      { field: 'valueMetrics.UtilizationReceive', header: 'Receive Utilization' }
    ];
  }

  public ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.Working();
    const component = this;
    this.reportsService.getCircuits().subscribe(x => {
      this.model = x;
      this.calculateAverageMetrics();
      this.Ready();
    });
  }

  private calculateAverageMetrics() {
    this.averageMetrics = {
      market: Math.round(this.model.reduce((sum, circuit) => sum + circuit.valueMetrics.market, 0) / this.model.length),
      packetLoss: Math.round(this.model.reduce((sum, circuit) => sum + circuit.valueMetrics.packetLoss, 0) / this.model.length),
      latency: Math.round(this.model.reduce((sum, circuit) => sum + circuit.valueMetrics.latency, 0) / this.model.length),
      uptime: Math.round(this.model.reduce((sum, circuit) => sum + circuit.valueMetrics.uptime, 0) / this.model.length),
      utilizationSend: Math.round(this.model.reduce((sum, circuit) => sum + circuit.valueMetrics.utilizationSend, 0) / this.model.length),
      utilizationReceive:
        Math.round(this.model.reduce((sum, circuit) => sum + circuit.valueMetrics.utilizationReceive, 0) / this.model.length)
    };
  }

  public averageValueScore(): number {
    if (!this.model || this.model.length < 1) {
      return 0;
    }

    return Math.round(this.model.reduce((sum, circuit) => sum + circuit.valueScore, 0) / this.model.length);
  }
}
