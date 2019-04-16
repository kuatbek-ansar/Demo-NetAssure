import { Component } from '@angular/core';
import { ConfigService } from '../../services';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html'
})
export class AppFooterComponent {
  public Version: string;

  public Year: number;

  constructor(private configService: ConfigService) {
    this.Version = this.configService.Version();

    this.Year = (new Date()).getFullYear();
  }
}
