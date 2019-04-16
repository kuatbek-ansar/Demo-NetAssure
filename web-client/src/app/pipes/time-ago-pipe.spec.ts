import { TimeAgoPipe } from './time-ago-pipe';
import * as moment from 'moment';

describe('TimeAgoPipe', () => {
    it('should get the time ago', () => {
        const sut = new TimeAgoPipe();
        const toTest = moment().add(-1, 'years').format();
        expect(sut.transform(toTest)).toBe('a year ago');
    });
});
