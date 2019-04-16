import { Component, Injector, OnInit } from '@angular/core';

import { ArrowDirection } from '../number-card/arrow-direction.enum';
import { ManagedDeviceService } from '../../../services';
import { WidgetComponent } from '../../../containers';

@Component({
  selector: 'managed-devices-count',
  templateUrl: 'managed-devices-count.component.html',
  styleUrls: [
    'managed-devices-count.component.scss'
  ]
})
export class ManagedDevicesCountComponent extends WidgetComponent implements OnInit {
  public direction: ArrowDirection;

  public current: number;

  public navigateTo = '/reports/ManagedDevices';

  constructor(
    private injector: Injector,
    private managedDeviceService: ManagedDeviceService
  ) {
    super(injector);
  }

  public ngOnInit() {
    this.getData();
  }

  private getData(): void {
    this.Working();

    this.managedDeviceService.getCount().subscribe(result => {
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
