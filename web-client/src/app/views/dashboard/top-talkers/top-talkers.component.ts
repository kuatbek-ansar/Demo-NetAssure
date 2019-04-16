import { Component, OnInit, Injector } from '@angular/core';
import { ReportsService } from '../../../services';
import { WidgetComponent } from '../../../containers/index';
import * as d3 from 'd3';

@Component({
  selector: 'top-talkers',
  templateUrl: './top-talkers.component.html',
  styleUrls: ['./top-talkers.component.scss']
})
export class TopTalkersComponent extends WidgetComponent implements OnInit {
  model: any = {};
  public colors = [{backgroundColor: []}, {backgroundColor: []}, {backgroundColor: []}];

  constructor(
    private injector: Injector,
    private reportsService: ReportsService
  ) {
    super(injector);

    const colorScale = d3.scale.category10();
    const color1 = colorScale('1');
    const color2 = colorScale('2');
    const color3 = colorScale('3');

    for (let i = 0; i < 10; i++) {
      this.colors[0].backgroundColor.push(color1);
      this.colors[1].backgroundColor.push(color2);
      this.colors[2].backgroundColor.push(color3);
    }
  }

  ngOnInit() {
    this.Working();

    this.reportsService.getTopTalkers().subscribe(res => {
      this.model.raw = res;
      this.model.labels = this.model.raw.map(x => x.ipv4_src_addr);
      this.model.data = [{data: this.model.raw.map(x => x.total_bytes / (1000 * 1000)), label: 'Total Traffic (MB)'},
        {data: this.model.raw.map(x => x.total_in_bytes / (1000 * 1000)), label: 'Received (MB)'},
        {data: this.model.raw.map(x => x.total_out_bytes / (1000 * 1000)), label: 'Sent (MB)'}
      ];

      this.Ready();
    });
  }
}
