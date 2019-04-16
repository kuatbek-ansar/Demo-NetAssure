import { Inject } from 'typedi';

import { ZabbixService, LogService } from '../../services';

import { Path, POST, Errors } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';

class ItemId {
  itemid: string;
  value_type: string;
}

class HistoryData {
  itemid: string;
  ns: number;
  value: number;
  clock: number;
}

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('History')
@Path('/history')
export class HistoryController {
  @Inject()
  private zabbixService: ZabbixService;

  @Inject()
  private logService: LogService;

  constructor() {
  }

  @POST
  @Path('/get-for-item')
  public async getHistoryForItem(items: ItemId[]): Promise<HistoryData[]> {
    const itemids = items.map(i => i.itemid).filter(i => i);
    const value_types: Set<any> = new Set(items.map(i => i.value_type));

    if (value_types.size !== 1) {
      this.logService.error('Error on get-for-item. Items must have same value type', {valueTypes: value_types});
      throw new Errors.BadRequestError('Items must have the same value type');
    }

    if (itemids.length < 1) {
      this.logService.error('Error on get-for-item. Missing item id', {itemIds: itemids});
      throw new Errors.BadRequestError('Missing Item Id');
    }

    const timeLimit = Math.round(new Date().getTime() / 1000) - (60 * 60 * 24)
    const params = {
      output: 'extend',
      history: value_types.values().next().value,
      itemids: itemids,
      sortfield: 'clock',
      sortorder: 'DESC',
      time_from: `${timeLimit}`,
      limit: 1440 * itemids.length
    };

    try {
      const zabbixResponse = await this.zabbixService.post('history.get', params);

      // Reformat number strings to numbers
      const reformed = zabbixResponse.result.map(d => ({
          itemid: d.itemid,
          ns: Number(d.ns),
          value: Number(d.value),
          clock: Number(d.clock)
        })
      );

      return reformed;
    } catch (e) {
      this.logService.error('Unable to get history get-for-item', {params: params}, e);
      throw new Errors.InternalServerError();
    }
  }
}
