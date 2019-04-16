import * as aws from 'aws-sdk';
import * as fs from 'fs';
import { AWSError } from 'aws-sdk/lib/error';
import { DeleteObjectOutput, ListObjectsV2Output, PutObjectOutput, ListObjectVersionsOutput, GetObjectOutput } from 'aws-sdk/clients/s3';
import { Service } from 'typedi';
import { AwsFile } from '../../models/aws-file';
import { LogService } from '../services/log.service';
import { AwsVersionedFile } from '../../models';
import { ConfigService } from './config.service';
import { Config } from '../config';


@Service()
export class AwsService {
  private s3: aws.S3;
  private config: Config;
  constructor(private log: LogService, private configService: ConfigService) {
    this.config = configService.GetConfiguration();
    this.s3 = new aws.S3({
      secretAccessKey: this.config.aws.secretKey,
      accessKeyId: this.config.aws.accessKeyId,
      region: this.config.aws.region
    });
  }

  public async getVersions(directory: string): Promise<any> {
    const params = {
      Bucket: this.config.aws.bucket,
      MaxKeys: 2147483647,
      Prefix: directory,
      Delimiter: directory
    };

    return new Promise((resolve, reject) => {
      this.log.debug('Call to S3 to list object versions', { params: params, directory: directory });
      const me = this;
      this.s3.listObjectVersions(params, function (error: AWSError, data: ListObjectVersionsOutput) {
        if (error) {
          this.log.error('Unable to list object versions from S3', { params: params }, error);
          return reject(error);
        } else {
          const files = data.Versions.map((item) => {
            return {
              name: item.Key.replace(`${directory}/`, ''),
              url: `${me.config.aws.bucketUrl}${me.config.aws.bucket}/${item.Key}`,
              size: item.Size,
              lastModified: item.LastModified,
              versionId: item.VersionId === 'null' ? null : item.VersionId
            } as AwsVersionedFile;
          });

          return resolve(files);
        }
      });
    });
  };

  public async get(directory: string): Promise<any> {
    const params = {
      Bucket: this.config.aws.bucket,
      MaxKeys: 2147483647,
      Prefix: directory,
      StartAfter: `${directory}/`,
      Delimiter: directory
    };

    return new Promise((resolve, reject) => {
      this.log.debug('Call to S3 to list objects', { params: params, directory: directory });
      const me = this;
      this.s3.listObjectsV2(params, function (error: AWSError, data: ListObjectsV2Output) {
        if (error) {
          this.log.error('Unable to list objects from S3', { params: params }, error);
          return reject(error);
        } else {
          const files = data.Contents.map((item) => {
            return {
              name: item.Key.replace(`${directory}/`, ''),
              url: `${me.config.aws.bucketUrl}${me.config.aws.bucket}/${item.Key}`,
              size: item.Size,
              lastModified: item.LastModified
            } as AwsFile;
          });

          return resolve(files);
        }
      });
    });
  };

  public async getDownloadUrl(file: string, versionId: string = null): Promise<string> {
    const params: any = {
      Bucket: this.config.aws.bucket,
      Key: file
    };
    if (versionId) {
      params.VersionId = versionId;
    }
    this.log.debug('Call to S3 to get signed url', params);
    return new Promise<string>((resolve, reject) => {
      this.s3.getSignedUrl('getObject', params, (error: AWSError, url: string) => {
        if (error) {
          this.log.error('Unable to get signed url', { params: params }, error);
          return reject('Unable to get signed url');
        } else {
          return resolve(url);
        }
      });
    });
  }

  public async getContent(file: string, versionId: string = null): Promise<string> {
    const params: any = {
      Bucket: this.config.aws.bucket,
      Key: file
    };
    if (versionId) {
      params.VersionId = versionId;
    }
    this.log.debug('Call to S3 to get file content', params);
    return new Promise<string>((resolve, reject) => {
      this.s3.getObject(params, (error: AWSError, data: GetObjectOutput) => {
        if (error) {
          this.log.error('Unable to get file content', { params: params }, error);
          return reject('Unable to get file content');
        } else {
          return resolve(data.Body.toString());
        }
      });
    });
  }

  public async upload(uploadedFile: any, directory: string): Promise<any> {
    const fileTempPath = uploadedFile.file;
    const fileData = fs.createReadStream(fileTempPath);
    const fileName = uploadedFile.filename;
    const contentType = uploadedFile.mimetype;

    const params = {
      Bucket: this.config.aws.bucket,
      Key: `${directory}/${fileName}`,
      ACL: 'public-read',
      Body: fileData,
      ContentType: contentType
    };

    return new Promise((resolve, reject) => {
      this.log.debug('Call to S3 to put an object', { params: params, directory: directory });
      this.s3.putObject(params, function (error: AWSError, data: PutObjectOutput) {
        if (error) {
          this.log.error('Error when putting an object to S3', { params: params }, error);
          return reject(error);
        } else {
          return resolve(data);
        }
      });
    });
  };

  public async delete(fileKey: string): Promise<any> {
    // Some string replacements to be able to pass in the full storage param
    if (fileKey.includes(this.config.aws.bucketUrl)) {
      fileKey = fileKey.replace(this.config.aws.bucketUrl, '');
    }

    if (fileKey.includes(this.config.aws.bucket)) {
      fileKey = fileKey.replace(this.config.aws.bucket, '');
    }

    if (fileKey.startsWith('/')) {
      fileKey = fileKey.substr(1);
    }

    const params = {
      Bucket: this.config.aws.bucket,
      Key: fileKey
    };

    return new Promise((resolve, reject) => {
      this.log.debug('Call to S3 to delete', { params: params });
      this.s3.deleteObject(params, function (error: AWSError, data: DeleteObjectOutput) {
        if (error) {
          this.log.error('Error when deleting an object from S3', { params: params }, error);
          return reject(error);
        } else {
          return resolve(data);
        }
      });
    });
  };
}
