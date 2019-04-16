import { mock, instance, anything, when, verify } from 'ts-mockito';
import { expect } from 'chai';
import { CostingService } from './costing.service';
import * as cache from 'memory-cache';

describe('Costing service: Unit', () => {
    let service: CostingService;
    beforeEach(() => {
        service = new CostingService();
    });
    describe('Costing appliances', () => {
        it('should set the price on a single unit', () => {
            const result = service.setProxyCosts([{ hostname: 'one', reportingDevices: 1, cost: 0, hostid: '1' }]);
            expect(result.length).to.equal(1);
            expect(result[0].cost).to.equal(service.appliancePricing[0].cost);
        });
        it('should set the price on multiple units', () => {
            const result = service.setProxyCosts([
                { hostname: 'one', reportingDevices: 1, cost: 0 , hostid: '1'},
                { hostname: 'two', reportingDevices: 1, cost: 0 , hostid: '1'},
            ]);
            expect(result[0].cost).to.equal(service.appliancePricing[0].cost);
            expect(result[1].cost).to.equal(service.appliancePricing[1].cost);
        });
        it('should set the price on 11 units', () => {
            const result = service.setProxyCosts([
                { hostname: 'one', reportingDevices: 1, cost: 0 , hostid: '1'},
                { hostname: 'two', reportingDevices: 1, cost: 0 , hostid: '1'},
                { hostname: 'three', reportingDevices: 1, cost: 0 , hostid: '1'},
                { hostname: 'four', reportingDevices: 1, cost: 0 , hostid: '1'},
                { hostname: 'five', reportingDevices: 1, cost: 0 , hostid: '1'},
                { hostname: 'six', reportingDevices: 1, cost: 0 , hostid: '1'},
                { hostname: 'seven', reportingDevices: 1, cost: 0 , hostid: '1'},
                { hostname: 'eight', reportingDevices: 1, cost: 0 , hostid: '1'},
                { hostname: 'nine', reportingDevices: 1, cost: 0 , hostid: '1'},
                { hostname: 'ten', reportingDevices: 1, cost: 0 , hostid: '1'},
                { hostname: 'eleven', reportingDevices: 1, cost: 0 , hostid: '1'},
            ]);
            expect(result[0].cost).to.equal(service.appliancePricing[0].cost);
            expect(result[1].cost).to.equal(service.appliancePricing[1].cost);
            expect(result[2].cost).to.equal(service.appliancePricing[1].cost);
            expect(result[3].cost).to.equal(service.appliancePricing[1].cost);
            expect(result[4].cost).to.equal(service.appliancePricing[1].cost);
            expect(result[5].cost).to.equal(service.appliancePricing[1].cost);
            expect(result[6].cost).to.equal(service.appliancePricing[1].cost);
            expect(result[7].cost).to.equal(service.appliancePricing[1].cost);
            expect(result[8].cost).to.equal(service.appliancePricing[1].cost);
            expect(result[9].cost).to.equal(service.appliancePricing[1].cost);
            expect(result[10].cost).to.equal(service.appliancePricing[2].cost);
        });
    });

    describe('Costing billable devices', () => {
        it('should set the price on a single unit', () => {
            const result = service.setBillableDeviceCosts([{ name: 'one', hostid: '1', cost: 0 }]);
            expect(result.length).to.equal(1);
            expect(result[0].cost).to.equal(service.devicePricing[0].cost);
        });
        it('should set the price on multiple units', () => {
            const result = service.setBillableDeviceCosts([
                { name: 'one', hostid: '1', cost: 0 },
                { name: 'two', hostid: '2', cost: 0 }
            ]);
            expect(result[0].cost).to.equal(service.devicePricing[0].cost);
            expect(result[1].cost).to.equal(service.devicePricing[0].cost);
        });
        it('should set the price on more than 20 units', () => {
            const billableDevices = [];
            for (let i = 0; i < 25; i++) {
                billableDevices.push({ name: 'one', hostid: '1', cost: 0 });
            }
            const result = service.setBillableDeviceCosts(billableDevices);
            expect(result.length).to.equal(25);
            expect(result[0].cost).to.equal(service.devicePricing[0].cost);
            expect(result[19].cost).to.equal(service.devicePricing[0].cost);
            expect(result[20].cost).to.equal(service.devicePricing[1].cost);
            expect(result[23].cost).to.equal(service.devicePricing[1].cost);
        });
        it('should set the price on more than 250 units', () => {
            const billableDevices = [];
            for (let i = 0; i < 260; i++) {
                billableDevices.push({ name: 'one', hostid: '1', cost: 0 });
            }
            const result = service.setBillableDeviceCosts(billableDevices);
            expect(result.length).to.equal(260);
            expect(result[0].cost).to.equal(service.devicePricing[0].cost);
            expect(result[19].cost).to.equal(service.devicePricing[0].cost);
            expect(result[20].cost).to.equal(service.devicePricing[1].cost);
            expect(result[23].cost).to.equal(service.devicePricing[1].cost);
            expect(result[49].cost).to.equal(service.devicePricing[1].cost);
            expect(result[50].cost).to.equal(service.devicePricing[2].cost);
            expect(result[249].cost).to.equal(service.devicePricing[2].cost);
            expect(result[250].cost).to.equal(service.devicePricing[3].cost);
        });
    });
});
