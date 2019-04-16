import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-loading',
  templateUrl: 'app-loading.component.html',
  styleUrls: [
    '../../../../node_modules/spinkit/css/spinkit.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppLoadingComponent implements OnInit {
  public isLoading: boolean;

  constructor(private state: StateService) {
  }

  public ngOnInit() {
    this.state.Loading$.subscribe((data: boolean) => {
      this.isLoading = data;
    });
  }
}
