import { AdminProtection } from './admin-protection';
import { expect } from 'chai';

describe('AdminProtection Unit', () => {
    let sut: AdminProtection;
    beforeEach(() => {
        sut = new AdminProtection();
        sut.urlToContactFunctionMap = {'billing': 'billing'};
    });
    it('should allow non-admin routes', () => {
        let calledNext = false;
        sut.checkAdminRoutes({ path: '/boondoggle' }, {}, () => calledNext = true);
        expect(calledNext).to.equal(true);
    });

    it('should allow ping route', () => {
        let calledNext = false;
        sut.checkAdminRoutes({ path: '/ping' }, {}, () => calledNext = true);
        expect(calledNext).to.equal(true);
    });

    it('should check admin routes', () => {
        let calledNext = false;
        sut.checkAdminRoutes({
            path: '/admin/billing', user: {
                SalesforceAuth: {
                    UserGroups: ['billing']
                }
            }
        }, {}, () => calledNext = true);
        expect(calledNext).to.equal(true);
    });

    it('should handle case sensitivitiy', () => {
        let calledNext = false;
        sut.checkAdminRoutes({
            path: '/admin/BILLING', user: {
                SalesforceAuth: {
                    UserGroups: ['billing']
                }
            }
        }, { }, () => calledNext = true);
        expect(calledNext).to.equal(true);
    });

    it('should handle remapping', () => {
      sut.urlToContactFunctionMap = {'billing': 'View_Invoice'};
      let calledNext = false;
      sut.checkAdminRoutes({
          path: '/admin/BILLING', user: {
              SalesforceAuth: {
                  UserGroups: ['View_Invoice']
              }
          }
      }, { }, () => calledNext = true);
      expect(calledNext).to.equal(true);
  });

    it('should not allow on missing from groups', () => {
        let calledNext = false;
        let responseStatus = 200;
        const response = {
            sendStatus: function (status) {
                responseStatus = status;
            }
        };
        sut.checkAdminRoutes({
            path: '/admin/spilling', user: { // some people have a license to spill
                SalesforceAuth: {
                    UserGroups: ['billing']
                }
            }
        }, response, () => calledNext = true);
        expect(calledNext).to.equal(false);
        expect(responseStatus).to.equal(403);
    });
});
