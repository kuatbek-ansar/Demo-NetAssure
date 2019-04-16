import { expect } from 'chai'
import { Container } from 'typedi';
import { mock, instance, when, verify } from 'ts-mockito/lib/ts-mockito';
import { SalesForceAuthenticationService, ZabbixService, ZabbixHostService } from '../../services';
import { SNMPConfigController } from './snmp.controller';
import { DeviceSNMPConfiguration } from '../../entity';
import { DeviceSNMPConfigurationRepository } from '../../repositories';
import { Repository } from 'typeorm';
import { DataRepository } from '../../repositories/data.repository';

describe('SNMP Config controller: Unit', () => {
  let zabbix: ZabbixService;
  let sut: SNMPConfigController;
  let repo: DeviceSNMPConfigurationRepository;
  let orm: Repository<DeviceSNMPConfiguration>;

  beforeEach(function () {
    repo = mock(DeviceSNMPConfigurationRepository);
    zabbix = mock(ZabbixService);
    orm = mock(Repository);
    when(repo.getOrm()).thenReturn(Promise.resolve(instance(orm)));

    sut = new SNMPConfigController();
    sut.context = <any> {
      request: {
        'user': {
          HostGroup: {
            Id: 123
          }
        }
      }
    };

    sut.zabbixService = instance(zabbix);
    sut.deviceRepository = instance(repo);
  });

  describe('postDevice', () => {
    it('should save to the database', async () => {
      const config = new DeviceSNMPConfiguration();
      await sut.postDevice(1234, config);
      verify(repo.getOrm()).once();
      verify(orm.save(config)).once();
    });

    it('should save to the zabbix for v1', async () => {
      const config = new DeviceSNMPConfiguration();
      config.version = 'v1';
      config.community = 'a place where people hang out';
      await sut.postDevice(1234, config);
      verify(zabbix.setSnmpCommunityString('1234', config.community)).once();
    });

    it('should save to the zabbix for v2c', async () => {
      const config = new DeviceSNMPConfiguration();
      config.version = 'v2c';
      config.community = 'another place where people hang out';
      await sut.postDevice(4321, config);
      verify(zabbix.setSnmpCommunityString('4321', config.community)).once();
    });

    it('should not save to the zabbix for v3', async () => {
      const config = new DeviceSNMPConfiguration();
      config.version = 'v3';
      config.community = 'not here';
      await sut.postDevice(3322, config);
      verify(zabbix.setSnmpCommunityString('3322', config.community)).never();
    });
  });
});
