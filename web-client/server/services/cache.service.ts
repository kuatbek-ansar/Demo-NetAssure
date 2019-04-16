import * as cache from 'memory-cache';
import { Service } from 'typedi';

@Service()
export class CacheService {
    public get(key: string) {
        return cache.get(key);
    }

    public set(key: string, value: any, expiryInMS = 60000) {
        cache.put(key, value, expiryInMS);
    }

    public contains(key: string): boolean {
        return cache.get(key) !== null;
    }
}
