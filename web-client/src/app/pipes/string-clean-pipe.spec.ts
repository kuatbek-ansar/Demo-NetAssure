import { StringCleanPipe } from './string-clean-pipe';

describe('StringCleanPipe', () => {
    it('should remove escaped quotes', () => {
        const sut = new StringCleanPipe();
        expect(sut.transform('\\"support@affiniti.com\\"')).toBe('support@affiniti.com');
    });
});
