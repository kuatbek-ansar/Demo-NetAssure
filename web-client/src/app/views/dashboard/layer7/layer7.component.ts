import { Component, OnInit, Injector } from '@angular/core';
import { ReportsService } from '../../../services';
import { WidgetComponent } from '../../../containers/index';
import * as d3 from 'd3';

@Component({
  selector: 'layerseven',
  templateUrl: './layer7.component.html',
  styleUrls: ['./layer7.component.scss']
})
export class Layer7Component extends WidgetComponent implements OnInit {
  model: any = {};
  viewingDetails = false;
  selectedProtocol = '';

  public colors = [{backgroundColor: []}];

  constructor(
    private injector: Injector,
    private reportsService: ReportsService
  ) {
    super(injector);

    const colorScale = d3.scale.category10();

    for (let i = 0; i < 10; i++) {
      this.colors[0].backgroundColor.push(colorScale(i.toString()));
    }
  }

  ngOnInit() {
    this.Working();

    this.reportsService.getLayer7().subscribe(res => {
      this.model.raw = res;
      let remainder = 0;
      this.model.labels = this.model.raw.slice(0, 8).map(x => x.l7_proto_name);
      this.model.data = this.model.raw.slice(0, 8).map(x => x.total_bytes);

      if (this.model.raw.length > 9) {
        remainder = this.model.raw.map(x => x.total_bytes).slice(9).reduce((accumulator, currentValue) => accumulator + currentValue);
      }

      this.model.labels.push('Other');
      this.model.data.push(remainder);

      this.Ready();
    });
  }

  public click(event) {
    if (event.active.length > 0) {
      this.Working();
      this.selectedProtocol = this.model.raw[event.active[0]._index].l7_proto_name;
      this.viewingDetails = true;

      this.reportsService.getLayer7ForProtocol(this.selectedProtocol).subscribe(res => {
        let remainder = 0;
        const details: any = {details: [], labels: []};
        details.labels = res.slice(0, 8).map(x => x.ipv4_src_addr);
        details.data = res.slice(0, 8).map(x => x.total_bytes);

        if (res.length > 9) {
          remainder = res.map(x => x.total_bytes).slice(9).reduce((accumulator, currentValue) => accumulator + currentValue);
        }

        details.labels.push('Other');
        details.data.push(remainder);

        this.model.details = details;
        this.Ready();
      });
    }
  }

  public back() {
    this.viewingDetails = false;
  }
}
