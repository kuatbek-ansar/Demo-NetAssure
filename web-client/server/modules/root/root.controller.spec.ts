process.env.NODE_ENV = 'test';

import { expect } from 'chai'
import { Container } from 'typedi';
import { mock, instance, when } from 'ts-mockito/lib/ts-mockito';
import { SalesForceAuthenticationService, ZabbixService, ZabbixHostService } from '../../services';
import { RootController } from './root.controller';


describe('root controller', () => {
  let sut: RootController;
  let zabbix: ZabbixService;
  let salesForce: SalesForceAuthenticationService;

  beforeEach(function ()  {
    salesForce =  mock(SalesForceAuthenticationService);
    zabbix = mock(ZabbixService);

    Container.set(ZabbixService, instance(zabbix));
    Container.set(SalesForceAuthenticationService, instance(salesForce));

    sut = new RootController();
  })

  afterEach(function() {
    zabbix = null;
    salesForce = null;
    sut = null;
  })

  it('can be instantiated', done => {
    expect(sut).to.not.be.a('null');
    done();
  });

  it('has a ping method that always returns true', done => {
    expect(sut.ping()).to.be.true;
    done();
  });

  it('has a status method that shows when zabbix and salesforce are connected', async () => {

    when(zabbix.status()).thenReturn(Promise.resolve({id: '123'}));
    when(salesForce.status()).thenReturn(Promise.resolve({Connected: true}));

    const status = await sut.status()

    expect(status.API).to.be.true;
    expect(status.ZabbixAPI).to.be.true;
    expect(status.SalesforceAPI).to.be.true;

  });

  it('has a status method that shows when zabbix and salesforce are not connected', async () => {

    when(zabbix.status()).thenReturn(Promise.reject(false));
    when(salesForce.status()).thenReturn(Promise.resolve({}));

    const status = await sut.status()

    expect(status.API).to.be.true;
    expect(status.ZabbixAPI).to.be.false;
    expect(status.SalesforceAPI).to.be.false;

  });

});
