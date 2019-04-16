import { Component, Injector } from '@angular/core';
import { WidgetComponent } from '../../containers/widget-component';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends WidgetComponent {
  constructor(private injector: Injector) {
    super(injector);
    this.Ready();
  }
}
