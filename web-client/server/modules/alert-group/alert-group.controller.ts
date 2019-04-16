import { Inject } from 'typedi';
import { Server, Path, GET, POST, DELETE, PathParam, QueryParam, Errors, Context, ServiceContext, PUT } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';

import { AlertGroupRepository } from '../../repositories';
import { AlertGroup } from '../../entity/index';
import { LogService } from '../../services';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('AlertGroup')
@Path('/alertGroups')
export class AlertGroupController {
  @Context
  context: ServiceContext;

  @Inject()
  private repository: AlertGroupRepository;

  @Inject()
  private logService: LogService;

  @GET
  @Path('/')
  public async get(): Promise<Array<AlertGroup>> {
    const groupId = this.context.request['user'].HostGroup.Id;

    try {
      return await this.repository.find({ where: { groupId: groupId }, relations: ['members'] });
    } catch (e) {
      this.logService.error('Unable to get alert groups', { groupId: groupId }, e);

      throw new Errors.InternalServerError(e);
    }
  }

  @GET
  @Path('/:id')
  public async getOne(@PathParam('id') id: number): Promise<AlertGroup> {
    try {
      return await this.repository.findOne({ where: { id: id }, relations: ['members'] });
    } catch (e) {
      this.logService.error('Unable to get one alert group', { id: id }, e);

      throw new Errors.InternalServerError(e);
    }
  }

  @DELETE
  @Path('/:id')
  public async delete(@PathParam('id') id: number): Promise<boolean> {
    try {
      (await this.repository.getOrm()).deleteById(id);

      return true;
    } catch (e) {
      this.logService.error('Unable to delete alert group', { id: id }, e);

      throw new Errors.InternalServerError(e);
    }
  }

  @POST
  @Path('/')
  public async post(alertGroup: AlertGroup): Promise<AlertGroup> {
    alertGroup.groupId = this.context.request['user'].HostGroup.Id;

    try {
      const orm = await this.repository.getOrm();

      return await orm.save(alertGroup);
    } catch (e) {
      this.logService.error('Unable to save alert group', { alertGroup: alertGroup }, e);

      throw new Errors.InternalServerError(e);
    }
  }
}
