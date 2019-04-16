import { Inject } from 'typedi';
import { Repository } from 'typeorm';

import { Circuit, User } from '../../../models';
import { Circuit as CircuitEntity } from '../../entity';
import { CircuitRepository } from '../../repositories';

import { Server, Path, GET, POST, DELETE, PathParam, QueryParam, Errors, Context, ServiceContext } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';
import { ZabbixHostService } from '../../services/zabbixHost.service';
import { LogService } from '../../services/log.service';

class CountResponse {
  yesterday: number;
  current: number
};

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Circuits')
@Path('/circuit')
export class CircuitController {
  @Context
  context: ServiceContext;

  @Inject()
  private repository: CircuitRepository;

  @Inject()
  private zabbixHostService: ZabbixHostService;

  @Inject()
  private logService: LogService;

  constructor() {
  }

  @GET
  public async get(): Promise<Circuit[]> {
    const groupId = this.context.request['user'].HostGroup.Id;
    try {
      const circuitEntities = await this.repository.find({where: {group_id: groupId}, relations: ['vendor']});

      return await this.inflateCircuitEntities(circuitEntities);
    } catch (e) {
      this.logService.error('Unable to get circuit', {groupId: groupId}, e);
      throw new Errors.InternalServerError();
    }
  }

  @GET
  @Path('/count/')
  public async count(@QueryParam('since_date') sinceDate: string): Promise<CountResponse> {
    const groupId = this.context.request['user'].HostGroup.Id;
    try {
      const yesterdayDate = new Date(sinceDate);
      const orm = await this.repository.getOrm();
      const yesterdayCount = await orm.createQueryBuilder('circuit')
        .where('circuit.group_id = :groupId', {groupId: groupId})
        .andWhere(`creationDate < :sinceDate`, {sinceDate: yesterdayDate.toISOString()})
        .select('count(*)', 'count').getCount();

      const todayCount = await orm.createQueryBuilder('circuit')
        .where('group_id = :groupId', {groupId: groupId})
        .select('count(*)', 'count').getCount();

      return {yesterday: yesterdayCount, current: todayCount} as CountResponse;
    } catch (e) {
      this.logService.error('Unable to get circuit count', {groupId: groupId}, e);
      throw new Errors.InternalServerError();
    }
  }

  @POST
  public async create(circuit: any): Promise<Circuit> {
    if (!circuit) {
      throw new Errors.BadRequestError('Request body empty. Circuit cannot be created.')
    }
    const groupId = this.context.request['user'].HostGroup.Id;
    const entity: CircuitEntity = circuit;

    entity.creationDate = new Date();
    entity.group_id = groupId;

    try {
      const orm = await this.repository.getOrm();
      const dbEntity = await orm.save(entity);

      return new Circuit(dbEntity);
    } catch (e) {
      this.logService.error('Unable to create circuit', {groupId: groupId, circuit: entity}, e);
      throw new Errors.InternalServerError()
    }
  }

  @GET
  @Path('/host/:hostId')
  public async getForDevice(@PathParam('hostId') hostId: number): Promise<Circuit[]> {
    try {
      const circuitEntities = await this.repository.find({where: {host_id: hostId}});

      return await this.inflateCircuitEntities(circuitEntities)
    } catch (e) {
      this.logService.error('Unable to get circuit for device', {hostId: hostId}, e);
      throw new Errors.InternalServerError();
    }
  }

  @GET
  @Path('/item/:itemId')
  public async getForItems(@PathParam('itemId') itemId: number): Promise<Circuit[]> {
    try {
      const circuitEntities = await this.repository.find({where: {item_id: itemId}});

      return await this.inflateCircuitEntities(circuitEntities)
    } catch (e) {
      this.logService.error('Unable to get circuit for items', {itemId: itemId}, e);
      throw new Errors.InternalServerError();
    }
  }

  @DELETE
  @Path('/:circuit_id')
  public async delete(@PathParam('circuit_id') circuitId: number): Promise<number> {
    try {
      const orm = await this.repository.getOrm();
      await orm.delete({circuit_id: circuitId});

      return circuitId;
    } catch (e) {
      this.logService.error('Unable to delete circuit', {circuitId: circuitId}, e);
      throw new Errors.InternalServerError();
    }
  }

  private async inflateCircuitEntities(circuitEntities: CircuitEntity[]) {
    const user: User = this.context.request['user'];
    const groupId: string = user.HostGroup.Id;

    const hostIds = circuitEntities.map(x => x.host_id.toString());
    const hostMonitoringData = await this.zabbixHostService.getHosts(groupId, hostIds)
      .then(hostArray => hostArray.reduce((hash, host) => {
          hash[host.hostId] = host.hostItems.reduce((dataHash, item) => {
            dataHash[item.itemid] = item.monitoringData;
            return dataHash;
          }, {});
          return hash;
        }, {})
      );

    // While we asked for data about a bunch of hosts, we may not have gotten information
    // about all of them. We need to filter out the circuits associated with hosts that
    // zabbix did not tell us anything about, as they may not belong to our group.
    const filteredCircuits = circuitEntities.filter(circuit => hostMonitoringData[circuit.host_id])

    return Promise.all(filteredCircuits.map(async circuitEntity => {
      const circuit = new Circuit(circuitEntity);

      const hostData = hostMonitoringData[circuit.host_id][circuit.item_id];
      if (hostData) {
        const interfaceMonitoringData = {
          in: hostData.in,
          out: hostData.out,
        };

        if (circuit.remote_host_id) {
          circuit.monitoringData = await this.zabbixHostService.getCircuitMonitoringData(
            circuit.remote_host_id.toString(),
            interfaceMonitoringData);
        }
      }

      return circuit;
    }))

  }
}
