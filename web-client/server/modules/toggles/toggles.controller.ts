import { Inject } from 'typedi';
import { Path, GET, PathParam, Errors, Context, ServiceContext } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';
import { ToggleRepository } from '../../repositories/toggle.repository';
import { LogService } from '../../services/log.service';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Toggles')
@Path('/toggles')
export class TogglesController {
  @Context
  context: ServiceContext;

  @Inject()
  private repository: ToggleRepository;

  @Inject()
  private logService: LogService;

  constructor() {
  }


  @GET
  @Path('/:name')
  public async get(@PathParam('name') name: string): Promise<any> {
    try {
      const record = await this.repository.findOne({where: {name: name}});

      return record ? record.state : undefined;
    } catch (e) {
      this.logService.error('Unable to get toggle for name', {name: name}, e);
      throw new Errors.InternalServerError(e);
    }
  }
}
