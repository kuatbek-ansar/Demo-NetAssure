import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: 'app-no-data.component.html',
  styleUrls: [
    'app-no-data.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppNoDataComponent implements OnChanges {
  @Input() dataExists: boolean;

  @Input() message: string;

  constructor() {
  }

  public ngOnChanges() {
  }
}
