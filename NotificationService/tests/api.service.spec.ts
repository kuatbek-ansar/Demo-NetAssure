import 'reflect-metadata';
import {Container} from 'typedi';

import {ApiService, HttpService} from '../services';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const sinon = require('sinon');

describe('ApiService', () => {
    let service: ApiService;
    let httpService: HttpService;
    const fakeData = 'fakeData';
    const fakeToken = {Token: 'fakeToken'};

    before(function () {
        service = Container.get(ApiService);
        httpService = Container.get(HttpService);
    });
    after(function () {
    });

    it('Should Call Authenticate', async () => {
        const sandbox = sinon.sandbox.create();
        sandbox.stub(httpService, 'Post').callsFake((params) => Promise.resolve(fakeToken));

        await service.Authenticate();

        service.authToken.should.not.be.empty;

        assert.equal(service.authToken, fakeToken.Token);
        sandbox.restore();
    });

    it('Should Get Authentication Header', async () => {
        service.authToken = fakeToken.Token;

        const returnResult = await service.CreateAuthHeader();

        returnResult.should.not.be.empty;

        assert.deepEqual(returnResult, {Authorization: `Bearer ${fakeToken.Token}`});
    });

    it('Should Call Get', async () => {
        const sandbox = sinon.sandbox.create();
        sandbox.stub(service, 'Authenticate').callsFake((params) => Promise.resolve(fakeToken));
        sandbox.stub(httpService, 'Get').callsFake((params) => Promise.resolve(fakeData));

        const returnValue = await service.Get('fakeUrl');

        returnValue.should.not.be.empty;

        assert.equal(returnValue, fakeData);
        sandbox.restore();
    });

    it('Should Call Post', async () => {
        const sandbox = sinon.sandbox.create();
        sandbox.stub(service, 'Authenticate').callsFake((params) => Promise.resolve(fakeToken));
        sandbox.stub(httpService, 'Post').callsFake((params) => Promise.resolve(fakeData));

        const returnValue = await service.Post('fakeUrl');

        returnValue.should.not.be.empty;

        assert.deepEqual(returnValue, fakeData);
        sandbox.restore();
    });
});
