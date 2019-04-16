import { Inject } from 'typedi';
import { Security, Tags, Response } from 'typescript-rest-swagger';
import { Path, ServiceContext, Context, GET, Errors } from 'typescript-rest';

import { NotificationTypeRepository } from '../../repositories/index';
import { LogService } from '../../services';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('NotifcationTypes')
@Path('/notification-types')
export class NotificationTypeController {
  @Context
  context: ServiceContext;

  @Inject()
  private repository: NotificationTypeRepository;

  @Inject()
  private logService: LogService;

  constructor() {
  }

  @GET
  @Path('/')
  public async get(): Promise<Array<any>> {
    try {
      const records = await this.repository.find();

      return records.map(x => ({id: x.id, name: x.message}));
    } catch (e) {
      this.logService.error('Unable to get notification type', null, e);
      throw new Errors.InternalServerError(e);
    }
  }
}
