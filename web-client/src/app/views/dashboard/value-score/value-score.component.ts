import { Component, Injector, OnInit } from '@angular/core';

import { ArrowDirection } from '../number-card/arrow-direction.enum';
import { CircuitService, StateService } from '../../../services';
import { User, Account, Circuit } from '../../../../../models'
import { WidgetComponent } from '../../../containers';

@Component({
  selector: 'value-score',
  templateUrl: 'value-score.component.html',
  styleUrls: [
    'value-score.component.scss'
  ]
})
export class ValueScoreComponent extends WidgetComponent implements OnInit {
  direction = ArrowDirection;

  public navigateTo = '/reports/CircuitValueScores';

  circuits: Circuit[];
  isLoading: boolean;
  currentScore: number;

  constructor(
    private injector: Injector,
    private circuitService: CircuitService,
    private stateService: StateService
  ) {
    super(injector)
  }

  private getData() {
    this.isLoading = false;
    this.currentScore = null;

    this.circuitService.getAllCircuits().subscribe(circuits => {
      this.circuits = circuits;
      this.currentScore = this.averageValueScore();
      this.isLoading = false;
    });
  }

  public averageValueScore() {
    if (this.circuits.length < 1) {
      return 0;
    }

    return Math.round(this.circuits.reduce((sum, circuit) => sum + circuit.valueScore, 0) / this.circuits.length);
  }

  public ngOnInit() {
    this.getData();
  }
}
