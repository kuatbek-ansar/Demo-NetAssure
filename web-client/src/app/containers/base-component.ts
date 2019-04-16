import { Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { StateService } from 'app/services';

export class BaseComponent implements OnDestroy {
  public isLoading: boolean;

  protected state: StateService;

  private subscription: Subscription;

  private loadingSubscription: Subscription;

  public constructor(injector: Injector) {
    if (injector) {
      this.state = injector.get(StateService);

      this.loadingSubscription = this.state.Loading$.subscribe((data: boolean) => {
        this.isLoading = data;
      });

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
    this.subscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }

  public Working() {
    if (this.state) {
      this.state.Working();
    }
  }

  public Ready() {
    if (this.state) {
      this.state.Ready();
    }
  }
}
