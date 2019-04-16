import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../containers';
import { CircuitPredictive } from '../../../../../models/circuit-predictive.model';
import * as d3 from 'd3';
import * as moment from 'moment';
import { CircuitPredictiveService } from '../../../services/circuit-predictive.service';
import { PredictiveData } from './models/predictive-data';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class CircuitDetailsComponent extends BaseComponent implements OnInit {

  private id: string;
  public model: PredictiveData;
  public chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  }

  public outlookLengths = [
    { days: 30, name: '30 days' },
    { days: 60, name: '60 days' },
    { days: 90, name: '90 days' },
    { days: 183, name: '6 months' },
    { days: 365, name: '1 year' },
    { days: 548, name: '18 months' }
  ];

  public colors = [];

  constructor(injector: Injector, private circuitPredictiveCircuit: CircuitPredictiveService, private route: ActivatedRoute) {
    super(injector);

    const colorScale = d3.scale.category10();
    this.colors.push({ borderColor: colorScale('sent') });
    this.colors.push({ borderColor: colorScale('received') });
    this.colors.push({ borderColor: colorScale('sent'), borderDash: [5, 5] });
    this.colors.push({ borderColor: colorScale('received'), borderDash: [5, 5] });

  }

  ngOnInit() {
    this.Working();
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.circuitPredictiveCircuit.getCircuitPredictive(this.id).subscribe(x => {
        this.model = new PredictiveData();
        this.model.averageBitsReceived = x.averageBitsReceived;
        this.model.averageBitsSent = x.averageBitsSent;
        this.model.highBitsReceived = x.highBitsReceived;
        this.model.highBitsSent = x.highBitsSent;
        this.model.lowBitsReceived = x.lowBitsReceived;
        this.model.lowBitsSent = x.lowBitsSent;
        this.model.willBreachSLA = x.willBreachSLA;
        this.model.willBreachSLAIn = x.willBreachSLAIn;
        this.model.predictiveData.labels = x.predictiveData.map(y => moment(y.date).format('YYYY-MM-DD'));
        this.model.predictiveData.data = [
          {
            data: x.predictiveData.filter(y => moment.utc(y.date) < moment.utc()).map(y => y.bitsSent),
            label: 'Bits Sent'
          },
          {
            data: x.predictiveData.filter(y => moment.utc(y.date) < moment.utc()).map(y => y.bitsReceived),
            label: 'Bits Received'
          },
          {
            data: x.predictiveData.filter(y => moment.utc(y.date) >= moment.utc()).map(y => y.bitsSent),
            label: 'Bits Sent (predicted)'
          },
          {
            data: x.predictiveData.filter(y => moment.utc(y.date) >= moment.utc()).map(y => y.bitsReceived),
            label: 'Bits Received (predicted)'
          }
        ];
        this.Ready();
      });
    });
  }

}
