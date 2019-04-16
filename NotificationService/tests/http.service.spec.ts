import {HttpService} from '../services';

const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('request-promise-native');
const should = require('should');
const sinon = require('sinon');

describe('HttpService', () => {
    let service: HttpService;
    const fakeData = 'fakeData';
    const sandbox = sinon.sandbox.create();

    before(function () {
        service = new HttpService();
    });
    after(function () {
        sandbox.restore();
    });

    it('Should Call Get', async () => {
        sandbox.stub(request, 'get').callsFake((params) => Promise.resolve(fakeData));

        const returnValue = await service.Get('fakeUrl');

        returnValue.should.not.be.empty;

        assert.deepEqual(returnValue, fakeData);
    });

    it('Should Call Post', async () => {
        sandbox.stub(request, 'post').callsFake((params) => Promise.resolve(fakeData));

        const returnValue = await service.Post('fakeUrl', 'body');

        returnValue.should.not.be.empty;

        assert.deepEqual(returnValue, fakeData);
    });
});
