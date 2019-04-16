import { Inject } from 'typedi';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import * as _ from 'lodash';

import { Server, Path, GET, POST, DELETE, PathParam, QueryParam, Errors, Context, ServiceContext } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';
import { ZabbixHostService } from '../../services/zabbixHost.service';
import { LogService } from '../../services/log.service';
import { CircuitPredictive } from '../../../models';

class CountResponse {
  yesterday: number;
  current: number
};

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('CircuitPredictive')
@Path('/circuit-predictive')
export class CircuitPredictiveController {
  @Context
  context: ServiceContext;

  @Inject()
  private zabbixHostService: ZabbixHostService;

  @Inject()
  private logService: LogService;

  constructor() {
  }

  @GET
  @Path('/:id')
  public async get(@PathParam('id') id: string): Promise<CircuitPredictive> {
    const groupId = this.context.request['user'].HostGroup.Id;
    try {
      // TODO: actually implement this
      const slaThroughput = { bitsSent: 1000, bitsReceived: 1000 };
      const model = new CircuitPredictive();
      model.predictiveData = [
        {
          bitsReceived: 500,
          bitsSent: 200,
          date: new Date(2018, 1, 2)
        },
        {
          bitsReceived: 23146780,
          bitsSent: 34567890,
          date: new Date(2018, 1, 3)
        },
        {
          bitsReceived: 674532,
          bitsSent: 73429,
          date: new Date(2018, 1, 4)
        },
        {
          bitsReceived: 9800,
          bitsSent: 7845932,
          date: new Date(2018, 1, 5)
        },
        {
          bitsReceived: 1500,
          bitsSent: 233,
          date: new Date(2018, 1, 6)
        }
      ];
      model.highBitsReceived = _.max(model.predictiveData.map(x => x.bitsReceived));
      model.highBitsSent = _.max(model.predictiveData.map(x => x.bitsSent));
      model.lowBitsReceived = _.min(model.predictiveData.map(x => x.bitsReceived));
      model.lowBitsSent = _.min(model.predictiveData.map(x => x.bitsSent));
      model.averageBitsReceived = _.mean(model.predictiveData.map(x => x.bitsReceived));
      model.averageBitsSent = _.mean(model.predictiveData.map(x => x.bitsSent));
      model.willBreachSLA = model.highBitsReceived > slaThroughput.bitsReceived || model.highBitsSent > slaThroughput.bitsSent;
      model.willBreachSLAIn = moment([2018, 8, 12]).fromNow();
      return model;
    } catch (e) {
      this.logService.error('Unable to get circuit prediction', { groupId: groupId }, e);
      throw new Errors.InternalServerError();
    }
  }
}
