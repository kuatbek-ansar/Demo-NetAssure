import { Component, Injector, OnInit } from '@angular/core';

import { ArrowDirection } from '../number-card/arrow-direction.enum';
import { WidgetComponent } from '../../../containers';
import { CircuitService } from '../../../services';
import { Circuit } from '../../../../../models';

@Component({
  selector: 'sla-violations',
  templateUrl: 'sla-violations.component.html',
  styleUrls: [
    'sla-violations.component.scss'
  ]
})
export class SlaViolationsComponent extends WidgetComponent implements OnInit {

  public direction = ArrowDirection;

  public navigateTo = '/reports/SLAViolations';

  circuits: Circuit[];
  isLoading: boolean;
  currentSlaViolations: number;

  constructor(
    private injector: Injector,
    private circuitService: CircuitService
  ) {
    super(injector);
  }

  public ngOnInit() {
    this.getData();
  }

  private getData(): void {
    this.isLoading = false;
    this.currentSlaViolations = null;

    this.circuitService.getAllCircuits().subscribe(circuits => {
      this.circuits = circuits;
      this.currentSlaViolations = this.countSlaViolations();
      this.isLoading = false;
    });

  }

  private countSlaViolations(): number {
    return this.circuits.reduce((sum, circuit) => sum + circuit.slaViolations.total, 0);
  }
}
