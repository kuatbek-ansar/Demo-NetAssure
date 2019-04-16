import { ProxyCost, ManagedDeviceCost } from '../../models';
import { Service } from 'typedi';

@Service()
export class CostingService {
    public appliancePricing = [
        { startingCount: 0, endingCount: 1, cost: 500 },
        { startingCount: 1, endingCount: 10, cost: 250 },
        { startingCount: 10, endingCount: Number.MAX_SAFE_INTEGER, cost: 100 }
    ];

    public devicePricing = [
        { startingCount: 0, endingCount: 20, cost: 0 },
        { startingCount: 20, endingCount: 50, cost: 10 },
        { startingCount: 50, endingCount: 250, cost: 8 },
        { startingCount: 250, endingCount: Number.MAX_SAFE_INTEGER, cost: 6 }
    ];
    public setProxyCosts(proxies: Array<ProxyCost>): Array<ProxyCost> {
        const items: Array<ProxyCost> = JSON.parse(JSON.stringify(proxies));
        for (let i = 0; i < items.length; i++) {
            items[i].cost = this.appliancePricing.find(x => i >= x.startingCount && i < x.endingCount).cost;
        }
        return items;
    }

    public setBillableDeviceCosts(devices: Array<ManagedDeviceCost>) {
        const items: Array<ManagedDeviceCost> = JSON.parse(JSON.stringify(devices));
        for (let i = 0; i < items.length; i++) {
            items[i].cost = this.devicePricing.find(x => i >= x.startingCount && i < x.endingCount).cost;
        }
        return items;

    }
}
