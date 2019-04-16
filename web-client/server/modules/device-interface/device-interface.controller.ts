import { Inject } from 'typedi';

import { DeviceInterface } from '../../entity';
import { DeviceInterfaceRepository } from '../../repositories';

import { Errors, Path, GET } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';
import { LogService } from '../../services';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Interfaces')
@Path('/interface')
export class DeviceInterfaceController {
  @Inject()
  private repository: DeviceInterfaceRepository;

  @Inject()
  private logService: LogService;

  constructor() {
  }

  @GET
  public async get(): Promise<DeviceInterface[]> {
    try {
      return await this.repository.find();
    } catch (e) {
      this.logService.error('Unable to get Device Interface', null, e);
      throw new Errors.InternalServerError();
    }
  }
}
