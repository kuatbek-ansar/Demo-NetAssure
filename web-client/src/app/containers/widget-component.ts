import { Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { StateService } from 'app/services';

export class WidgetComponent implements OnDestroy {
  public isLoading: boolean;

  protected state: StateService;

  private subscription: Subscription;

  public constructor(injector: Injector) {
    if (injector) {
      this.state = injector.get(StateService);
      this.subscription = this.state.AccountStateChanged$.subscribe(() => {
        this.ngOnInit();
      });
    }
  }

  // this is a place holder method in case child component's don't implement nginit
  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public Working() {
    this.isLoading = true;
  }

  public Ready() {
    this.isLoading = false;
  }
}
