import 'reflect-metadata';
import { Container } from 'typedi/Container';

import { SalesForceAuthenticationService } from './salesforce-authentication.service';
import { expect } from 'chai';

describe('SalesForce Authentication Service: Integration', () => {
  let service: SalesForceAuthenticationService;

  before(function () {
    service = Container.get(SalesForceAuthenticationService);
  });

  it('Should Authenticate', function (done) {
    this.timeout(40000);

    service.authenticate().then(data => {
      expect(data).to.not.be.empty;
      expect(data).to.have.property('Id');
      expect(data.Id).to.not.be.empty;
      done();
    });
  });

  it('Should Get Status', function (done) {
    this.timeout(40000);
    service.status().then(data => {
      expect(data).to.not.be.empty;
      expect(data).to.have.property('Connected');
      expect(data.Connected).to.be.true;
      done();
    });
  });
});
