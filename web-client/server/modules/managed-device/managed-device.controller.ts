import { Inject } from 'typedi';
import { Context, Errors, GET, Path, PathParam, POST, PUT, ServiceContext } from 'typescript-rest';
import { Response, Security, Tags } from 'typescript-rest-swagger';

import { DeviceManagementHistory } from '../../entity/device-management-history.entity';
import { DeviceManagementHistoryRepository } from '../../repositories/device-management-history.repository';
import { ManagedDevice } from '../../entity';
import { ManagedDeviceViewModel } from './models/ManagedDeviceViewModel';
import { ManagedDeviceRepository } from '../../repositories';
import { ZabbixService, LogService } from '../../services';

class CountResponse {
  yesterday: number;
  current: number
};

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Managed Devices')
@Path('/managed-device')
export class ManagedDeviceController {
  @Context
  context: ServiceContext;

  @Inject()
  private repository: ManagedDeviceRepository;

  @Inject()
  private zabbixService: ZabbixService;

  @Inject()
  private deviceManagementHistoryRepository: DeviceManagementHistoryRepository;

  @Inject()
  private logService: LogService;

  constructor() {
  }

  @POST
  public async create(viewModel: ManagedDeviceViewModel): Promise<DeviceManagementHistory> {
    if (!viewModel) {
      this.logService.error('No viewModel for managed device create', null);
      throw new Errors.BadRequestError('Request body empty. Managed device cannot be created.');
    }

    const entity: ManagedDevice = this.mapViewModelToEntity(viewModel);
    const history: DeviceManagementHistory = new DeviceManagementHistory();

    history.changeDate = new Date();
    history.destinationManagedState = entity.isManaged;
    history.host_id = entity.host_id;

    try {
      const orm = await this.repository.getOrm();
      await orm.save(entity);

      const otherOrm = await this.deviceManagementHistoryRepository.getOrm();
      const result = await otherOrm.save(history);

      await this.zabbixService.setManaged(entity.host_id.toString(), entity.isManaged);

      return result;
    } catch (e) {
      this.logService.error('Unable to create managed device', {managedDevice: entity, history: history}, e);
      throw new Errors.InternalServerError();
    }
  }

  @PUT
  @Path('/host/:device_id')
  public async update(viewModel: ManagedDeviceViewModel): Promise<any> {
    if (!viewModel) {
      this.logService.error('No view model for managed device update', null);
      throw new Errors.BadRequestError('Request body empty. Managed device cannot be created.')
    }

    const entity: ManagedDevice = this.mapViewModelToEntity(viewModel);
    const history: DeviceManagementHistory = new DeviceManagementHistory();

    history.changeDate = new Date();
    history.destinationManagedState = entity.isManaged;
    history.host_id = entity.host_id;

    try {
      const orm = await this.repository.getOrm();
      const dbEntity = await orm.save(entity);

      const otherOrm = await this.deviceManagementHistoryRepository.getOrm();
      await otherOrm.save(history);

      await this.zabbixService.setManaged(entity.host_id.toString(), entity.isManaged);

      return dbEntity;
    } catch (e) {
      this.logService.error('Unable to update managed device', {managedDevice: entity, history: history}, e);
      throw new Errors.InternalServerError();
    }
  }

  @GET
  @Path('/host/:deviceId')
  public async findOneByHostId(@PathParam('deviceId') deviceId: number): Promise<ManagedDevice> {
    try {
      const orm = await this.repository.getOrm();
      const entity = await orm.findOne({host_id: deviceId});

      entity.isManaged = <any>entity.isManaged === 1;

      return entity;
    } catch (e) {
      this.logService.error('Unable to find managed device by host id', {deviceId: deviceId}, e);
      throw new Errors.InternalServerError(e);
    }
  }

  @GET
  public async getAll(): Promise<any[]> {
    try {
      const orm = await this.repository.getOrm();
      const entities: Array<any> = await (orm.query(`select md.*, d.mostRecentActivation
                                                     from managed_device md inner join
                                                      (select host_id,
                                                              max(changeDate) mostRecentActivation
                                                        from device_management_history
                                                       where destinationManagedState=1
                                                       group by host_id) d
                                                          on d.host_id=md.host_id
                                                        where md.group_id=?`,
        [this.context.request['user'].HostGroup.Id]));
      const hosts = await this.getHosts(entities.map(x => `${x.host_id}`));

      for (const entity of entities) {
        const host = hosts.find(x => `${entity.host_id}` === x.hostid);

        if (host) {
          entity.hostname = host.name;
        }

        entity.isManaged = entity.isManaged === 1;
      }

      return entities;
    } catch (e) {
      this.logService.error('Unable to get all managed devices', null, e);
      throw new Errors.InternalServerError
    }
  }

  @GET
  @Path('/counts')
  public async getManagedDevicesCount(): Promise<number> {
    const queryResult = await (await this.repository.getOrm()).query(
      `
      select  (select COALESCE(sum(destinationManagedState),0)
      from    (
              select    dh.host_id, max(dh.changeDate) changeDate
              from      device_management_history dh
                        inner join managed_device md
                        on dh.host_id = md.host_id
              where     group_id= ?
              group by  host_id) q
              inner join
              device_management_history sq
              on q.host_id = sq.host_id and q.changeDate = sq.changeDate
      ) current,
      (
        select  COALESCE(sum(destinationManagedState),0)
        from    (
                select    dh.host_id, max(changeDate) changeDate
                from      device_management_history dh
                          inner join managed_device md
                          on dh.host_id = md.host_id
                where     group_id=?
                          and changeDate < date_add(now(), interval -1 day)
                group by  host_id
                ) q
                inner join
                device_management_history sq
                on q.host_id = sq.host_id and q.changeDate = sq.changeDate
       ) yesterday`, [this.context.request['user'].HostGroup.Id, this.context.request['user'].HostGroup.Id]);

    return queryResult[0];
  }

  private async getHosts(hosts: string[]) {
    const params = {
      output: [
        'hostid',
        'name'
      ],
      hostids: hosts
    };

    const zabbixResponse = await this.zabbixService.post('host.get', params);

    return zabbixResponse.result;
  }

  private mapViewModelToEntity(viewModel: ManagedDeviceViewModel): ManagedDevice {
    const model = new ManagedDevice();

    model.group_id = viewModel.group_id;
    model.host_id = viewModel.host_id;
    model.isManaged = viewModel.isManaged;
    model.id = viewModel.id;

    return model;
  }
}
