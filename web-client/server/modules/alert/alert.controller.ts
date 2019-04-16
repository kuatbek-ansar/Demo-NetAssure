import { Context, DELETE, Errors, GET, Path, PathParam, POST, ServiceContext } from 'typescript-rest';
import { Inject } from 'typedi';
import { Response, Security, Tags } from 'typescript-rest-swagger';

import { Alert } from '../../entity';
import { AlertRepository } from '../../repositories';
import { LogService } from '../../services';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Alert')
@Path('/alerts')
export class AlertController {
  @Context
  context: ServiceContext;

  @Inject()
  private repository: AlertRepository;

  @Inject()
  private logService: LogService;

  @GET
  @Path('/')
  public async get(): Promise<Array<Alert>> {
    const groupId = this.context.request['user'].HostGroup.Id;

    try {
      return await this.repository.find({ where: { groupId: groupId } });
    } catch (e) {
      this.logService.error('Unable to get alerts for group id', { groupId: groupId }, e);

      throw new Errors.InternalServerError(e);
    }
  }

  @GET
  @Path('/:id')
  public async getOne(@PathParam('id') id: number): Promise<Alert> {
    try {
      return await this.repository.findOne({
        where: { id: id },
        relations: ['managedDevices', 'notifications', 'alertGroups']
      });
    } catch (e) {
      this.logService.error('Unable to get alert for id', { id: id }, e);

      throw new Errors.InternalServerError(e);
    }
  }

  @GET
  @Path('/byDeviceId/:id/:severity')
  public async getByDeviceId(@PathParam('id') id: number, @PathParam('severity') severity: number): Promise<Alert[]> {
    try {
      const orm = await this.repository.getOrm();

      const query = await orm.createQueryBuilder('alerts')
        .innerJoinAndSelect('alerts.managedDevices', 'managedDevices')
        .innerJoinAndSelect('alerts.notifications', 'notifications')
        .innerJoinAndSelect('alerts.alertGroups', 'alertGroups')
        .where('managedDevices.host_id = :id', { id })
        .andWhere('severity in (:severity)', { severity: [-1, severity] });

      const alerts = query.getMany();

      return alerts;
    } catch (e) {
      this.logService.error('Unable to get alert by device id', { id: id }, e);

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
      this.logService.error('Unable to delete alert by id', { id: id }, e);

      throw new Errors.InternalServerError(e);
    }
  }

  @POST
  @Path('/')
  public async post(alert: Alert): Promise<Alert> {
    alert.groupId = this.context.request['user'].HostGroup.Id;

    try {
      const orm = await this.repository.getOrm();

      return await orm.save(alert);
    } catch (e) {
      this.logService.error('Unable to save alert', { alert: alert }, e);

      throw new Errors.InternalServerError(e);
    }
  }
}
