import { Component, Input, OnInit, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { HistoryService } from '../../services';
import { Graph } from '../../../../models';
import * as d3 from 'd3';
import 'nvd3';
import { OnChanges } from '@angular/core';

const lineFormats: any = {
  // Possible values:
  // 0 - (default) line;
  // 1 - filled region;
  // 2 - bold line;
  // 3 - dot;
  // 4 - dashed line;
  // 5 - gradient line.
  '0': {type: 'line'},
  '1': {type: 'line', area: true, fillOpacity: 0.5},
  '2': {type: 'line', strokeWidth: '2px'},
  '3': {type: 'line'},
  '4': {type: 'line', classed: 'dashed'},
  '5': {type: 'line'},
};

const dateFormatter = d3.time.format.multi([
  ['.%L', d => d.getMilliseconds()],
  [':%S', d => d.getSeconds()],
  ['%H:%M', d => d.getMinutes()],
  ['%H:00', d => d.getHours()],
  ['%m/%d', d => d.getDay() && d.getDate() !== 1],
  ['%m/%d', d => d.getDate() !== 1],
  ['%b', d => d.getMonth()],
  ['%Y', () => true]
]);

const daysFromNow = (n) => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + n);
}

@Component({
  selector: 'app-device-chart',
  templateUrl: 'app-device-chart.component.html',
  styleUrls: [
    '../../../../node_modules/nvd3/build/nv.d3.css'
  ],
  encapsulation: ViewEncapsulation.None
})

export class AppDeviceChartComponent implements OnInit, OnChanges {
  @ViewChild('nvd3') nvd3;
  @Input() public graph: Graph;
  chartIsLoading = false;
  chartData: any[] = [];
  chartDataByItemId: any;
  chartOptions: any = {
    chart: {
      type: 'lineWithFocusChart',
      height: 450,
      margin: {
        top: 20,
        right: 55,
        bottom: 50,
        left: 55
      },
      x: d => d.clock * 1000 + d.ns / 1000000,
      y: d => d.value,
      xAxis: {
        axisLabel: 'Time',
        showMaxMin: false,
        tickFormat: d => dateFormatter(new Date(d)),
      },
      focusShowAxisX: false,
      xScale: d3.time.scale(),
      useVoronoi: false,
      yAxis: {
        axisLabelDistance: -10,
        axisLabel: '',
        showMaxMin: false,
        tickFormat: d3.format('s'),
      },
      tooltip: {
        enabled: false
      },
      legend: {
        maxKeyLength: 100
      }
    }
  };

  panZoomState: any = {
    panning: false,
    zooming: false,
    x: 0,
    scale: null
  };

  formatLegendTitle(name, units) {
    name = name.replace(/^.*:/, '');
    const maxKeyLength = this.chartOptions.chart.legend.maxKeyLength;

    if (units) {
      units = ` (${units})`
    } else {
      units = ''
    }

    if (name.length + units.length > maxKeyLength) {
      name = name.substring(0, maxKeyLength - units.length - 2) + '..';
    }

    return name + units;
  }

  constructor(
    private historyService: HistoryService,
  ) {
  }

  @HostListener('dblclick')
  restoreZoom() {
  }

  async ngOnChanges(changes: any) {
    if (changes.graph && (changes.graph.previousValue !== changes.graph.currentValue)) {
      if (changes.graph.previousValue) {
        // do we need to clean anything up?
      }

      if (this.graph) {
        this.chartData = [];
        this.chartIsLoading = true;

        // We need an amalgam of data elements from the item and the gitem for each element
        // of the graph
        this.chartDataByItemId = {};

        this.graph.gitems.forEach(gi => {
          this.chartDataByItemId[gi.itemid] = {
            ...lineFormats[gi.drawtype],
            yAxis: gi.yaxisside ? Number(gi.yaxisside) + 1 : 1,
            color: gi.color ? `#${gi.color}` : undefined,
          };
        });

        this.graph.items.forEach(i => {
          this.chartDataByItemId[i.itemid] = {
            ...this.chartDataByItemId[i.itemid],
            key: this.formatLegendTitle(i.name, i.units),
            units: i.units,
            values: [],
          }
        });

        this.restoreZoom();

        this.historyService.getForItem(this.graph.items)
          .subscribe((data) => {
            data.forEach(d => {
              if (d.clock) {
                this.chartDataByItemId[d.itemid].values.push(d);
              }
            });
            this.chartData = Object.keys(this.chartDataByItemId).map(k => this.chartDataByItemId[k]).filter(cd => cd.values.length > 0);
            this.chartIsLoading = false;
          })
      }
    }
  }

  async ngOnInit() {
  }

  onmousedown(event) {
    const button = event.button;
    const x = event.x;

    if (button !== 2 && button !== 0) {
      return
    }

    this.panZoomState.x = x;
    this.panZoomState.scale = this.nvd3.chart.xScale().copy();

    if (button === 0) {
      this.panZoomState.panning = true;
      this.panZoomState.zooming = false;
      event.preventDefault();
    }
    if (button === 2) {
      this.panZoomState.panning = false;
      this.panZoomState.zooming = true;
      event.preventDefault();
    }
  }

  onmousedrag(event) {
    const delta = (event.x - this.panZoomState.x);
    const scale = this.panZoomState.scale;

    if (this.panZoomState.panning) {
      const range = scale.range();
      this.chartOptions.chart.xDomain[0] = scale.invert(range[0] - delta);
      this.chartOptions.chart.xDomain[1] = scale.invert(range[1] - delta);
      this.nvd3.chart.update();
      event.preventDefault()
    } else if (this.panZoomState.zooming) {
      const range = scale.range();
      this.chartOptions.chart.xDomain[0] = scale.invert(range[0] - delta);
      this.nvd3.chart.update();
      event.preventDefault()
    }

    if (event.type === 'mouseup') {
      this.panZoomState.panning = false;
      this.panZoomState.zooming = false;
    }
  }

  onmouseleave(event) {
    if (this.panZoomState.panning || this.panZoomState.zooming) {
      this.panZoomState.panning = false;
      this.panZoomState.zooming = false;
      event.preventDefault();
    }
  }
}
