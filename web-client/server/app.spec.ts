process.env.NODE_ENV = 'test';
import { expect } from 'chai'
import * as request from 'supertest';
import * as app from './app';

describe('App: Unit', () => {
  let server
  beforeEach(function () {
    server = app.default
    this.timeout(5000);
  });

  afterEach(function () {
  });

  it('should not be null', done => {
    expect(server).to.not.be.a('null');
    done();
  })

  it('responds to /ping', done => {
    request(server)
      .get('/ping')
      .expect(200, done);
    });

  it('401 other requests without a token', done => {
    request(server)
      .get('/circuit')
      .expect(401, done);
  });
});
