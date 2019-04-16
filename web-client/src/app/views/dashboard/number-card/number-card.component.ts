import { Component, Injector, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { WidgetComponent } from '../../../containers';
import { ArrowDirection } from './arrow-direction.enum';

@Component({
  selector: 'number-card',
  templateUrl: './number-card.component.html',
  styleUrls: ['./number-card.component.scss',
    '../../../../../node_modules/spinkit/css/spinkit.css']
})
export class NumberCardComponent extends WidgetComponent implements OnInit {
  @Input() title: string;

  @Input() isLoading: boolean;

  @Input() number: number;

  @Input() direction: ArrowDirection;

  @Input() navigateTo: string;

  public arrowDirection = ArrowDirection;

    public onClick() {
    if (this.navigateTo) {
      this.router.navigate([this.navigateTo])
    }
  }

  constructor(
    protected router: Router,
    private injector: Injector
  ) {
    super(injector)
  }

  public ngOnInit() {
  }
}


