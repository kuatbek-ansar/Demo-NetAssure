import { ZabbixProxyService } from './zabbixProxy.service';
import { ZabbixService } from './zabbix.service';
import { mock, instance, anything, when, verify } from 'ts-mockito';
import { expect } from 'chai';
import { CacheService } from './cache.service';
import { LogService } from './log.service';

describe('Zabbix proxy service: Unit', () => {
  describe('getting by group id', () => {
    let service: ZabbixProxyService;
    const mockZabbixService: ZabbixService = mock(ZabbixService);
    const mockLogService: LogService = mock(LogService);
    let mockCacheService: CacheService;
    beforeEach(function () {
      mockCacheService = mock(CacheService);
      when(mockCacheService.contains(anything())).thenReturn(false);
      when(mockZabbixService.post('proxy.get', anything())).thenReturn(Promise.resolve({
        jsonrpc: '2.0',
        'result': [
          {
            'host': 'TX-AFF-AFTXHQ',
            'proxyid': '10260',
            'hosts': [
              {
                'hostid': '10255',
                'name': 'co-aff-ftden-fw1'
              },
              {
                'hostid': '10269',
                'name': 'demo switch'
              },
              {
                'hostid': '10270',
                'name': 'TX-AFF-AFTXHQ'
              },
              {
                'hostid': '10272',
                'name': 'aftx-sw2'
              }
            ]
          },
          {
            'host': 'PA-SVCS-HUNT',
            'proxyid': '10274',
            'hosts': [
              {
                'hostid': '10275',
                'name': 'PA-SVCS-HUNT'
              },
              {
                'hostid': '10276',
                'name': 'USG'
              }
            ]
          },
          {
            'host': 'PA-SVCS-HUNT2',
            'proxyid': '10279',
            'hosts': [
              {
                'hostid': '9001',
                'name': 'PA-SVCS-HUNT'
              },
              {
                'hostid': '10276',
                'name': 'USG'
              }
            ]
          },
          {
            'host': 'PA-SVCS-HUNT3',
            'proxyid': '10279',
            'hosts': [
            ]
          }
        ]
      }));
      when(mockZabbixService.post('host.get', anything())).thenReturn(Promise.resolve(
        {
          'jsonrpc': '2.0',
          'result': [
            {
              'hostid': '10255',
              'groups': [
                {
                  'groupid': '2'
                },
                {
                  'groupid': '4'
                }
              ]
            },
            {
              'hostid': '10275',
              'groups': [
                {
                  'groupid': '12'
                },
                {
                  'groupid': '4'
                }
              ]
            },
            {
              'hostid': '9001',
              'groups': [
                {
                  'groupid': '12'
                },
                {
                  'groupid': '4'
                }
              ]
            }
          ],
          'id': 1
        }
      ));
      service = new ZabbixProxyService(instance(mockZabbixService), instance(mockCacheService), instance(mockLogService));
    });

    it('Should handle empty group', async () => {
      const result = await service.getByGroupId('44');
      expect(result.length).to.equal(0);
    });

    it('Should get proxy for a group', async () => {
      const result = await service.getByGroupId('2');
      expect(result.length).to.equal(1);
      expect(result[0].hostname).to.equal('TX-AFF-AFTXHQ');
      expect(result[0].hostid).to.equal('10260');
      expect(result[0].reportingDevices).to.equal(4);
    });

    it('Should get proxies for a group if multiple', async () => {
      const result = await service.getByGroupId('12');
      expect(result.length).to.equal(2);
      expect(result[0].hostname).to.equal('PA-SVCS-HUNT');
      expect(result[0].reportingDevices).to.equal(2);
      expect(result[1].hostname).to.equal('PA-SVCS-HUNT2');
      expect(result[1].reportingDevices).to.equal(2);
    });

    it('Should check cache for proxies and hosts', async () => {
      const result = await service.getByGroupId('2');
      verify(mockCacheService.contains('ZabbixProxyService:proxiesAndHosts')).called();
    });

    it('Should check cache for host group map', async () => {
      const result = await service.getByGroupId('2');
      verify(mockCacheService.contains('ZabbixProxyService:hostGroupMap')).called();
    });

    it('Should populate cached proxies and hosts', async () => {
      const result = await service.getByGroupId('2');
      verify(mockCacheService.set('ZabbixProxyService:proxiesAndHosts', anything())).called();
    });

    it('Should populate cached host group map', async () => {
      const result = await service.getByGroupId('2');
      verify(mockCacheService.set('ZabbixProxyService:hostGroupMap', anything())).called();
    });

    it('Should cache proxies and hosts', async () => {
      when(mockCacheService.contains('ZabbixProxyService:proxiesAndHosts')).thenReturn(true);
      when(mockCacheService.get('ZabbixProxyService:proxiesAndHosts')).thenReturn([{ hosts: [], host: '' }]);
      const result = await service.getByGroupId('2');
      verify(mockCacheService.contains('ZabbixProxyService:proxiesAndHosts')).called();
      verify(mockCacheService.get('ZabbixProxyService:proxiesAndHosts')).called();
    });

    it('Should cache host group map', async () => {
      when(mockCacheService.contains('ZabbixProxyService:hostGroupMap')).thenReturn(true);
      when(mockCacheService.get('ZabbixProxyService:hostGroupMap')).thenReturn([]);
      when(mockCacheService.contains('ZabbixProxyService:proxiesAndHosts')).thenReturn(true);
      when(mockCacheService.get('ZabbixProxyService:proxiesAndHosts')).thenReturn([{ hosts: [], host: '' }]);
      const result = await service.getByGroupId('2');
      verify(mockCacheService.contains('ZabbixProxyService:hostGroupMap')).called();
    });
  });
});
