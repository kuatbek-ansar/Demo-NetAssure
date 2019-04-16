import { mock, instance, anything, when, verify } from 'ts-mockito';
import { expect } from 'chai';
import { CacheService } from './cache.service';
import * as cache from 'memory-cache';

describe('Cache service: Unit', () => {
    let service: CacheService;
    beforeEach(() => {
        service = new CacheService();
    });
    describe('Setting cache value', () => {
        it('should set a value that can be retrieved', () => {
            service.set('a key', 1);
            expect(cache.get('a key')).to.equal(1);
        });
        it('should clear a value after a period of time', (done) => {
            service.set('a key', 1, 10);
            setTimeout(() => {
                // tslint:disable-next-line:no-unused-expression
                expect(cache.get('a key')).to.be.null;
                done();
            }, 20);
        });
    });
    describe('Getting cache value', () => {
        it('should get a value that can be retrieved', () => {
            cache.put('a key', 1);
            expect(service.get('a key')).to.equal(1);
        });
        it('should return null if not in cache', () => {
            // tslint:disable-next-line:no-unused-expression
            expect(service.get('a key that clearly is not contained in the cache')).to.be.null;
        });
    });
    describe('Checking if cache contains a key', () => {
        it('should return true if it does', () => {
            service.set('a key', 1);
            expect(service.contains('a key')).to.equal(true);
        });
        it('should return true if it does', () => {
            expect(service.contains('a key that clearly is not contained in the cache')).to.equal(false);
        });
    });
});
