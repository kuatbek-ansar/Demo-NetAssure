import { ConfigService } from './config.service';
import { expect } from 'chai';

describe('Config service: Unit', () => {
  it('should get global config', () => {
    const value = 'a value';
    (<any>global).config = { aws: { accessKeyId: value } };
    const sut = new ConfigService();
    const configuration = sut.GetConfiguration();
    expect(configuration.aws.accessKeyId).to.equal(value);
  });

  it('should get a value from the environment if it exists', () => {
    const value = 'an env value';
    process.env['aws:accessKeyId'] = value;
    const sut = new ConfigService();
    const configuration = sut.GetConfiguration();
    expect(configuration.aws.accessKeyId).to.equal(value);
  });
  afterEach(() => {
    delete (<any>global).config;
  })
});
