import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-widget-loading',
  templateUrl: 'app-widget-loading.component.html',
  styleUrls: [
    '../../../../node_modules/spinkit/scss/spinners/3-wave.scss',
    './app-widget-loading.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppWidgetLoadingComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() isSmall = false;

  constructor() {
  }

  public ngOnInit() {
  }
}
