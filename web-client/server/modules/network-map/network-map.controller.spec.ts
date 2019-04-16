
import { NetworkMapController } from './network-map.controller';
import { NetworkMapRepository } from '../../repositories';
import { NetworkMap } from '../../entity';
import { LogService } from '../../services/log.service';
import * as aws from 'aws-sdk';

import { expect } from 'chai'
import { Container } from 'typedi';
import { mock, instance, when, verify } from 'ts-mockito/lib/ts-mockito';
import { AwsService } from '../../services';

import { Repository } from 'typeorm';
import { DataRepository } from '../../repositories/data.repository';

describe('Network Map Controller: Unit', () => {
  let sut: NetworkMapController;
  const mockNetworkMapRepository = mock(NetworkMapRepository);
  const mockLogService = mock(LogService);
  const mockS3 = mock(aws.S3);
  const mockAws = mock(AwsService);

  let orm: Repository<NetworkMap>;

  beforeEach(function () {
    orm = mock(Repository);

    when(mockNetworkMapRepository.getOrm()).thenReturn(Promise.resolve(instance(orm)));
    when(orm.find({ group_id: 1 })).thenReturn(Promise.resolve([new NetworkMap()]));

    when(mockAws.getDownloadUrl('network-maps/1/somefile.jpg', null)).thenReturn(Promise.resolve('http://foo.url'));

    sut = new NetworkMapController();
    // sut.s3 = instance(mockS3);
    sut.repository = instance(mockNetworkMapRepository);
    sut.logService = instance(mockLogService);
    sut.aws = instance(mockAws);
  });

  describe('getByGroupId', () => {

    it('should fetch the results from the database', async () => {
      // todo: call the respository/db/something...

    });

    it('should transform the URL for the image', async () => {
      sut.context = <any> {
        request: {
          'user': {
            HostGroup: {
              Id: 1
            }
          }
        }
      };

      // call the aws service
      const result = await sut.getSignedImage('somefile.jpg', null);
      expect(result.url).to.equal('http://foo.url');
    });

  });

});
