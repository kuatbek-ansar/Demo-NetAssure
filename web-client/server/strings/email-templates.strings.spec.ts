import { EmailTemplate } from './email-templates.strings';
import { expect } from 'chai'

describe('Email Templates: Unit', function() {
    describe('Password Reset', function() {
        it('should not be empty', function() {
            const tempPwd = EmailTemplate.PasswordReset;
            expect(tempPwd).to.not.be.empty;
        });
    });
});