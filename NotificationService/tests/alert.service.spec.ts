import 'reflect-metadata';
import { Container } from 'typedi';
import { Alert, AlertApiData } from '../models';

import { AlertService, ApiService } from '../services';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const sinon = require('sinon');

describe('AlertService', () => {
    let service: AlertService;
    let apiService: ApiService;
    const fakeAlerts: Alert[] = [];
    const sandbox = sinon.sandbox.create();

    before(function () {
        apiService = Container.get(ApiService);
        service = Container.get(AlertService);
    });
    after(function () {
        sandbox.restore();
    });

    it('Should Call Get', async () => {
        sandbox.stub(apiService, 'Get').callsFake((params) => Promise.resolve(fakeAlerts));

        const returnValue = await service.GetByItemId(10270, -1);

        returnValue.should.not.be.empty;

        assert.deepEqual(returnValue.Alerts, fakeAlerts);
    });
});
