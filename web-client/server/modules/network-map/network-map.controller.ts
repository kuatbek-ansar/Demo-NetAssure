import * as aws from 'aws-sdk';
import * as fs from 'fs';
import { Inject, Container } from 'typedi';
import { Path, GET, DELETE, PathParam, Errors, Context, ServiceContext, QueryParam } from 'typescript-rest';
import { Security, Tags, Response as SwaggerResponse } from 'typescript-rest-swagger';
import { NetworkMap } from '../../entity';
import { NetworkMapRepository } from '../../repositories';
import { Response, AwsService, ConfigService } from '../../services';
import { LogService } from '../../services/log.service';
import { AWSError } from 'aws-sdk';
import { Config } from '../../config';

class NetworkMapResult {
  id: number;
  groupId: number;
  name: string;
  fileName: string;
  fileLocation: string;
}

@Security('bearer')
@SwaggerResponse<string>(401, 'The user is unauthorized')
@Tags('Network Maps')
@Path('/network-map')
export class NetworkMapController {
  @Context
  context: ServiceContext;

  // todo: pushed s3 down to initialize in methods to allow for testing, needs to be injected -jc
  // public s3: aws.S3;

  @Inject()
  public repository: NetworkMapRepository;

  @Inject()
  public logService: LogService;

  @Inject()
  public aws: AwsService;

  private config: Config;

  constructor() {
    this.config = Container.get(ConfigService).GetConfiguration();
  }

  @GET
  @Path('/resolve-signed-url')
  public async getSignedImage(
    @QueryParam('fileName') fileName: string,
    @QueryParam('versionId') versionId: string = null): Promise<any> {

    this.logService.debug('resolving signed URL for image', {fileName: fileName});
    const groupId = this.context.request['user'].HostGroup.Id;
    try {
      const imagePath = `network-maps/${groupId}/${fileName}`;
      const url = await this.aws.getDownloadUrl(imagePath, versionId);
      return { url: url };
    } catch (e) {
      this.logService.error('Unable to resolve signed URL for provided location', { fileName: fileName }, e);
      throw new Errors.InternalServerError();
    }
  }

  @GET
  @Path('/')
  public async get(): Promise<NetworkMapResult[]> {
    const groupId = this.context.request['user'].HostGroup.Id;
    try {
      const orm = await this.repository.getOrm();
      const results: NetworkMap[] = await orm.find({ group_id: groupId });

      if (!results) {
        throw new Errors.InternalServerError('Error retrieving results from vendor_files');
      }

      return results.map(x => {
        return {
          id: x.id,
          groupId: x.group_id,
          name: x.name,
          fileName: x.file_name,
          fileLocation: x.file_location
        };
      });
    } catch (e) {
      this.logService.error('Unable to get Network Map by group id', { groupId: groupId }, e);
      throw new Errors.InternalServerError();
    }
  }



  public async upload(request, response): Promise<any> {
    if (!request.files) {
      response.status(403).json('No files to upload');
    }

    const groupId = request.params.groupId;
    const name = request.get('Name');

    const fileUploaded = request.files;
    const fileTmpPath = fileUploaded.file.file;
    const fileData = fs.createReadStream(fileTmpPath);
    const fileName = fileUploaded.file.filename;
    const contentType = fileUploaded.file.mimetype;

    const params = {
      Bucket: this.config.aws.bucket,
      Key: `network-maps/${groupId}/${fileName}`,
      ACL: 'public-read',
      Body: fileData,
      ContentType: contentType
    };

    const networkMap = {
      group_id: groupId,
      name: name,
      file_name: fileName,
      file_location: `${this.config.aws.bucketUrl}${this.config.aws.bucket}/${params.Key}`
    };

    const s3 = new aws.S3({
      secretAccessKey: this.config.aws.secretKey,
      accessKeyId: this.config.aws.accessKeyId,
      region: this.config.aws.region
    });

    s3.putObject(params, (function (error) {
      if (error) {
        this.logService.error('Unable to upload network map to S3',
          { bucket: params.Bucket, key: params.Key, contentType: params.ContentType },
          error
        );
        this.sendError(response, 503, 'Error uploading file to remote storage');
      } else {
        this.repository.getOrm().then(orm => {
          orm.save(networkMap).then(entity => {
            response.status(200).json(entity);
          });
        });
      }
    }).bind(this));
  };

  @DELETE
  @Path('/:id')
  public async delete(@PathParam('id') id: number): Promise<void> {
    const orm = await this.repository.getOrm();
    const entity: NetworkMap = await orm.findOneById(id);
    const fileName = entity.file_name;
    const groupId = this.context.request['user'].HostGroup.Id;

    const params = {
      Bucket: this.config.aws.bucket,
      Key: `network-maps/${entity.group_id}/${fileName}`,
    };

    const s3 = new aws.S3({
      secretAccessKey: this.config.aws.secretKey,
      accessKeyId: this.config.aws.accessKeyId,
      region: this.config.aws.region
    });

    s3.deleteObject(params, (async function (error) {
      if (error) {
        this.logService.error('Unable to delete network map from S3', { bucket: params.Bucket, key: params.Key }, error);
        throw new Errors.InternalServerError('Error deleting file from remote storage');
      } else {
        return await orm.delete(entity).then(() => null);
      }
    }));
  };

  private sendError(response: Response, httpCode: number, message: string): void {
    response.status(httpCode).json(message);
  }
}
