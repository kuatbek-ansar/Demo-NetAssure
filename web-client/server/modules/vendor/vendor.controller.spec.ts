
import { VendorController } from './vendor.controller';
import { VendorRepository } from '../../repositories';
import { Vendor } from '../../entity';
import { LogService } from '../../services/log.service';
import * as aws from 'aws-sdk';

import { expect } from 'chai'
import { Container } from 'typedi';
import { mock, instance, when, verify } from 'ts-mockito/lib/ts-mockito';
import { AwsService } from '../../services';

import { Repository } from 'typeorm';
import { DataRepository } from '../../repositories/data.repository';

describe('Vendor Controller: Unit', () => {
  let sut: VendorController;
  const mockVendorRepository = mock(VendorRepository);
  const mockLogService = mock(LogService);
  const mockS3 = mock(aws.S3);
  const mockAws = mock(AwsService);

  const knownGroupId = 123;
  const knownFileNameBase = 'there/this-is-a-fine-file.pdf';

  let orm: Repository<Vendor>;

  beforeEach(function () {
    orm = mock(Repository);

    when(mockVendorRepository.getOrm()).thenReturn(Promise.resolve(instance(orm)));
    when(mockAws.getDownloadUrl(`vendor-files/${knownGroupId}/${knownFileNameBase}`, null)).thenReturn(Promise.resolve('http://foo.url'));

    sut = new VendorController();

    sut.context = <any>{
      request: {
        'user': {
          HostGroup: {
            Id: knownGroupId
          }
        }
      }
    };

    sut.repository = instance(mockVendorRepository);
    sut.logService = instance(mockLogService);
    sut.awsService = instance(mockAws);
  });

  describe('generating url for document', () => {

    it('fetch the url from aws using the groupid from the user context', async () => {

      await sut.getDocumentUrl(knownFileNameBase);

      verify(mockAws.getDownloadUrl(`vendor-files/${knownGroupId}/${knownFileNameBase}`)).once();

    });



  });

});
