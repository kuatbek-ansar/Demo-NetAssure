import { mock, instance, anything, when, verify } from 'ts-mockito';
import { expect } from 'chai';

import { ZabbixHostIdNameService, CostingService } from '../services';
import { InvoiceGenerationService } from './invoice-generation.service';
import { DeviceManagementHistoryRepository } from '../repositories';
import { ZabbixProxyService } from './zabbixProxy.service';

describe('Invoice generation: Unit', () => {
    describe('Getting invoice', () => {
        it('should generate invoice header data', async () => {
            const sut = new InvoiceGenerationService();
            sut.getLineItems = () => Promise.resolve([]);
            const date = '2017-01-01';
            const groupId = '17';
            const generatedBy = 'Harry Potter';
            const invoice = await sut.generate(groupId, date, generatedBy);
            expect(invoice.creationDate.toISOString()).to.equal(new Date(date).toISOString());
            expect(invoice.generatedBy).to.equal(generatedBy);
            expect(invoice.customerId.toString()).to.equal(groupId);
            expect(invoice.number).to.equal('201701-17');
        })
    });

    describe('Getting billable device costs', () => {
        it('should return correct values', async () => {
            const groupId = '17';
            const date = '2018-01-01';
            const hostId = '7';
            const machineName = 'best machine';
            const sut = new InvoiceGenerationService();
            const mockCostingService = mock(CostingService);
            when(mockCostingService.setBillableDeviceCosts(anything())).thenReturn([
                { hostid: hostId, name: machineName, cost: 20 }
            ]);
            const mockZabbixHostNameLookup = mock(ZabbixHostIdNameService);
            when(mockZabbixHostNameLookup.getHostNames(anything())).thenReturn(Promise.resolve([
                { hostid: hostId, name: machineName, host: 'another name' }
            ]));
            const mockDeviceManagementHistoryRepository = mock(DeviceManagementHistoryRepository);
            when(mockDeviceManagementHistoryRepository.getBillableUnits(groupId, anything())).thenReturn(Promise.resolve([
                { hostid: hostId, name: null, cost: null }
            ]));
            sut.costingService = instance(mockCostingService);
            sut.zabbixHostNameLookup = instance(mockZabbixHostNameLookup);
            sut.repository = instance(mockDeviceManagementHistoryRepository);

            const result = await sut.getBillableDeviceCosts(groupId, date);

            expect(result.length).to.equal(1);
            expect(result[0].cost).to.equal(20);
            expect(result[0].name).to.equal(machineName);
            expect(result[0].hostid).to.equal(hostId);
        });
    });

    describe('Getting proxy costs', () => {
        let mockZabbixProxyService;
        let mockCostingService;
        let sut;
        beforeEach(() => {
            mockZabbixProxyService = mock(ZabbixProxyService);
            mockCostingService = mock(CostingService);
            sut = new InvoiceGenerationService();
            sut.zabbixProxyService = instance(mockZabbixProxyService);
            sut.costingService = instance(mockCostingService);
        });
        it('should pass correct parameters to proxy service', () => {
            sut.getProxyCosts('17');

            verify(mockZabbixProxyService.getByGroupId('17')).called();
        });

        it('should add costs', async () => {
            when(mockZabbixProxyService.getByGroupId(anything()))
                .thenReturn([{ hostname: 'pam the proxy', reportingDevices: 7, cost: 0 }]);
            const cost = 50;
            when(mockCostingService.setProxyCosts(anything()))
                .thenReturn([{ hostname: 'pam the proxy', reportingDevices: 7, cost: cost }]);
            sut.zabbixProxyService = instance(mockZabbixProxyService);
            sut.costingService = instance(mockCostingService);

            expect((await sut.getProxyCosts('17'))[0].cost).to.equal(cost);
        });
    });
});
