import { Inject, Container } from 'typedi';
import { String } from 'typescript-string-operations';
import { Server, Path, GET, POST, DELETE, PathParam, QueryParam, Errors, Context, ServiceContext } from 'typescript-rest';
import { Security, Tags, Response } from 'typescript-rest-swagger';
import { AwsFile, DeviceBackupConfig, GlobalBackupConfig } from '../../../models';
import { AwsService, ConfigService } from '../../services';
import { DeviceBackupConfigRepository, GlobalBackupConfigRepository } from '../../repositories';
import { GlobalBackupConfiguration, DeviceBackupConfiguration } from '../../entity';
import { LogService } from '../../services/log.service';
import { BackupUrl } from './models/backup-url';
import { Config } from '../../config';

@Security('bearer')
@Response<string>(401, 'The user is unauthorized')
@Tags('Backups')
@Path('/backup')
export class BackupController {
  @Context
  context: ServiceContext;

  @Inject()
  private aws: AwsService;

  @Inject()
  private deviceRepository: DeviceBackupConfigRepository;

  @Inject()
  private globalRepository: GlobalBackupConfigRepository;

  @Inject()
  private logService: LogService;

  private config: Config;
  constructor() {
    this.config = Container.get(ConfigService).GetConfiguration();
  }

  @GET
  @Path('/backups/:groupId/:deviceIp')
  public async getBackups(@PathParam('groupId') groupId: string, @PathParam('deviceIp') deviceIp: string): Promise<AwsFile[]> {
    try {
      groupId = groupId.replace('^0', '');

      const backupsDir = `${this.config.aws.backupsDirectory}/${groupId}`;
      const files: AwsFile[] = await this.aws.getVersions(backupsDir);
      const backup = files.filter(x => x.name === deviceIp);

      return backup;
    } catch (e) {
      this.logService.error('Unable to get Backups', { groupId: groupId, deviceIp: deviceIp }, e);
      throw new Errors.InternalServerError();
    }
  }

  @GET
  @Path('/geturl')
  public async getBackup(@QueryParam('path') path: string, @QueryParam('version') version: string): Promise<BackupUrl> {
    try {
      const backupsDir = `${this.config.aws.backupsDirectory}/${path}`;
      const url = await this.aws.getDownloadUrl(backupsDir, version);
      return { url: url };
    } catch (e) {
      this.logService.error('Unable to get Backups download url', { path: path, version: version }, e);
      throw new Errors.InternalServerError();
    }
  }

  @GET
  @Path('/getContent')
  public async getBackupContent(@QueryParam('path') path: string, @QueryParam('version') version: string): Promise<string> {
    try {
      const backupsDir = `${this.config.aws.backupsDirectory}/${path}`;
      const body = await this.aws.getContent(backupsDir, version);
      return body;
    } catch (e) {
      this.logService.error('Unable to get Backups download url', { path: path, version: version }, e);
      throw new Errors.InternalServerError();
    }
  }

  @GET
  @Path('/config')
  public async getGlobalConfig(): Promise<GlobalBackupConfiguration> {
    try {
      const orm = await this.globalRepository.getOrm();
      const globalBackupConfig = await orm.findOne();

      return globalBackupConfig || new GlobalBackupConfiguration();
    } catch (e) {
      this.logService.error('Unable to get Global Config', null, e);
      throw new Errors.InternalServerError();
    }
  }

  @GET
  @Path('/config/:deviceId')
  public async getDeviceConfig(@PathParam('deviceId') deviceId: number): Promise<DeviceBackupConfiguration> {
    try {
      const orm = await this.deviceRepository.getOrm();
      const deviceBackupConfig = await orm.findOne({ device_id: deviceId });

      return deviceBackupConfig || new DeviceBackupConfiguration();
    } catch (e) {
      this.logService.error('Unable to get Device Config', { deviceId: deviceId }, e);
      throw new Errors.InternalServerError();
    }
  }

  @POST
  @Path('/config')
  public async save(model: GlobalBackupConfig): Promise<void> {
    try {
      const globalOrm = await this.globalRepository.getOrm();
      const existingGlobalEntity = await globalOrm.findOne({ customer_id: this.context.request['user'].HostGroup.Id });

      if (existingGlobalEntity) {
        await globalOrm.update({ id: existingGlobalEntity.id }, model);
      } else {
        (<any>model).customer_id = this.context.request['user'].HostGroup.Id;
        await globalOrm.save(model);
      }

      return;
    } catch (e) {
      this.logService.error('Unable to save config', { model: model }, e);
      throw new Errors.InternalServerError();
    }
  }

  @POST
  @Path('/deviceconfig')
  public async devicesave(model: DeviceBackupConfig): Promise<void> {
    try {
      const orm = await this.deviceRepository.getOrm();
      const existingEntity = await orm.findOne({ device_id: model.device_id });

      if (existingEntity) {
        await orm.update({ id: existingEntity.id }, model);
      } else {
        await orm.save(model);
      }

      return;
    } catch (e) {
      this.logService.error('Unable to save device config', { model: model, deviceId: model.device_id }, e);
      throw new Errors.InternalServerError();
    }
  }
}
