import { Component, Injector, OnInit } from '@angular/core';

import { ArrowDirection } from '../number-card/arrow-direction.enum';
import { CircuitService } from '../../../services';
import { WidgetComponent } from '../../../containers';

@Component({
  selector: 'circuit-count',
  templateUrl: 'circuit-count.component.html',
  styleUrls: [
    'circuit-count.component.scss'
  ]
})
export class CircuitCountComponent extends WidgetComponent implements OnInit {
  public direction: ArrowDirection;

  public current: number;

  public navigateTo = '/reports/CircuitValueScores';

  constructor(
    private circuitService: CircuitService,
    private injector: Injector
  ) {
    super(injector);
  }

  public ngOnInit() {
    this.getData();
  }

  private getData(): void {
    this.Working();

    this.circuitService.getCount().subscribe(result => {
      this.current = result.current;

      if (result.current === result.yesterday) {
        this.direction = ArrowDirection.Unchanged;
      } else if (result.current > result.yesterday) {
        this.direction = ArrowDirection.GoingUp;
      } else {
        this.direction = ArrowDirection.GoingDown;
      }

      this.Ready();
    });
  }
}
