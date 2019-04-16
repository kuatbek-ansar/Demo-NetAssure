import * as fs from 'fs';
import * as aws from 'aws-sdk';
import { Inject, Container } from 'typedi';
import { Path, GET, DELETE, PathParam, Errors } from 'typescript-rest';
import { Security, Tags, Response as SwaggerResponse } from 'typescript-rest-swagger';
import { Response, AwsService, ConfigService } from '../../../services';
import { VendorFiles, VendorFileTypes } from '../../../entity';
import { VendorFilesRepository } from '../../../repositories';
import { LogService } from '../../../services/log.service';
import { Config } from '../../../config';

@Security('bearer')
@SwaggerResponse<string>(401, 'The user is unauthorized')
@Tags('Vendors')
@Path('/vendor/:groupId/:vendor/files')
export class VendorFilesController {
  private s3: aws.S3;

  @Inject()
  private repository: VendorFilesRepository;

  @Inject()
  private awsService: AwsService;

  @Inject()
  private logService: LogService;

  private config: Config;
  constructor() {
    this.config = Container.get(ConfigService).GetConfiguration();
    this.s3 = new aws.S3(
      {
        secretAccessKey: this.config.aws.secretKey,
        accessKeyId: this.config.aws.accessKeyId,
        region: this.config.aws.region
      }
    );
  }

  @GET
  public async getFileMetaData(@PathParam('groupId') groupId: number,
    @PathParam('vendor') name: string): Promise<any[]> {
    try {
      const orm = await this.repository.getOrm();

      // Match on files with group id and either group specific vendors, or global vendors
      const files = await orm.createQueryBuilder('files')
        .innerJoin('files.vendor', 'vendor')
        .leftJoinAndSelect('files.fileType', 'fileType')
        .where('files.group_id = :groupId', { groupId })
        .andWhere('vendor.name = :name', { name })
        .andWhere('(vendor.group_id = :groupId OR vendor.group_id = 0)', { groupId })
        .getMany();

      return files;
    } catch (e) {
      this.logService.error('Unable to get file metadata', {groupId: groupId, vendor: name}, e);
      throw new Errors.InternalServerError('Error retrieving vendor files')
    }
  }

  // TODO: figure out how to get upload working with Swagger
  public async uploadFile(req, res): Promise<void> {
    if (!req.files) {
      res.status(400).json({ message: 'No files to upload' });
    } else if (req.files.length > 1) {
      res.status(400).json({ message: 'Only upload 1 file at a time' });
    }

    const fileUploaded = req.files;
    const fileTmpPath = fileUploaded.file.file;
    const fileData = fs.createReadStream(fileTmpPath);

    const params = {
      Bucket: this.config.aws.bucket,
      Key: `vendor-files/${req.params.groupId}/${req.params.vendor}/${req.body.filename}`,
      ACL: 'public-read',
      Body: fileData
    };

    const fileMeta = JSON.parse(req.body.info);
    fileMeta['Location'] = `${this.config.aws.bucketUrl}${this.config.aws.bucket}/${params.Key}`;

    const self = this;
    this.s3.putObject(params, async (err, data) => {
      if (err) {
        this.logService.error('Unable to upload vendor file to S3',
          { bucket: params.Bucket, key: params.Key }, err);
        self.sendError(res, 503, 'Error uploading file to remote storage');
      } else {
        try {
          await self.saveFileMetaData(fileMeta);
        } catch (saveErr) {
          this.logService.error('Error saving file metata to database', {
            bucket: params.Bucket,
            key: params.Key
          }, saveErr);
          self.sendError(res, 503, 'Error saving file metatdata to database');
        }
        res.status(200).json({ message: 'file successfully uploaded' });
      }
    });
  };

  @DELETE
  @Path('/delete/:id')
  public async deleteFile(@PathParam('groupId') groupId: number,
    @PathParam('vendor') name: string,
    @PathParam('id') id: number,
    vendorBody: any): Promise<any> {
    try {
      await this.awsService.delete(vendorBody.Location);

      const vendorFileType = new VendorFileTypes();
      vendorFileType.id = vendorBody.FileType.Id;
      vendorFileType.file_type = vendorBody.FileType.FileType;

      const vendorFile = new VendorFiles();
      vendorFile.id = vendorBody.Id;
      vendorFile.group_id = vendorBody.GroupId;
      vendorFile.fileType = vendorFileType;
      vendorFile.file_location = vendorBody.Location;
      vendorFile.file_name = vendorBody.FileName;

      const orm = await this.repository.getOrm();
      await orm.remove(vendorFile);

      return { message: 'file successfully deleted' };
    } catch (err) {
      this.logService.error('Unable to delete vendor file from S3', {groupId: groupId, location: vendorBody.location}, err);
      throw new Errors.InternalServerError('Error deleting file from remote storage');
    }
  };

  private async saveFileMetaData(fileMetaData: any): Promise<any> {
    const vendorFileType = new VendorFileTypes();
    vendorFileType.file_type = fileMetaData.VendorFileType.FileType;
    vendorFileType.id = fileMetaData.VendorFileType.Id;

    const vendorFile = new VendorFiles();
    vendorFile.group_id = fileMetaData.GroupId;
    vendorFile.fileType = vendorFileType;
    vendorFile.file_name = fileMetaData.FileName;
    vendorFile.uploaded_date = fileMetaData.UploadedDate;
    vendorFile.file_location = fileMetaData.Location;
    vendorFile.hasSla = fileMetaData.HasSla;
    vendorFile.vendor = fileMetaData.Vendor;

    const orm = await this.repository.getOrm();
    await orm.save(vendorFile);
    return;
  };

  private sendError(response: Response, httpCode: number, errorMessage: string): void {
    response.status(httpCode).json({
      status: 'error',
      message: errorMessage
    });
  }
}
