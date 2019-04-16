import 'reflect-metadata';

import { notify } from '../handler';

const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('request-promise-native');
const should = require('should');
const sinon = require('sinon');

describe('Notification Handler', () => {
    const sandbox = sinon.sandbox.create();

    before(function () {
    });
    after(function () {
        sandbox.restore();
    });

    it('Should Get Alerts', async () => {
        notify({ body: { 'host_id': 10270, severity: 'average' } }, null);
    });

    it('Should Call Post', async () => {
    });
});
