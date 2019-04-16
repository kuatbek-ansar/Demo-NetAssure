process.env.NODE_ENV = 'test';
import { expect } from 'chai'
import { SystemClock } from './systemClock.helper';

describe('System Clock Helper Utility: Unit', function() {
    let helper: SystemClock;
    before(function () {
        helper = new SystemClock();
    });

    it('should return current date', function() {
        const systemNow = helper.GetNow();
        const rightNow = new Date();
        // Check the date down to seconds
        expect(systemNow.getFullYear()).to.equal(rightNow.getFullYear());
        expect(systemNow.getMonth()).to.equal(rightNow.getMonth());
        expect(systemNow.getDate()).to.equal(rightNow.getDate());
        expect(systemNow.getHours()).to.equal(rightNow.getHours());
        expect(systemNow.getMinutes()).to.equal(rightNow.getMinutes());
        expect(systemNow.getSeconds()).to.equal(rightNow.getSeconds());
    });
});