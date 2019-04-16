import { BillingController } from './billing.controller';

describe('Billing controller: Unit', () => {
    describe('pdf generation', () => {
        it('should build a pdf', () => {
            const sut = new BillingController();
            sut.getPdf('17');
        });
    });
});
