import * as request from 'request-promise';
import { Service } from 'typedi';

export type Response = any;

@Service()
export class HttpService {
  public get(uri: string): Promise<Response> {
    const options = {
      method: 'GET',
      uri,
      json: true
    };

    return request(options);
  }

  public post(uri: string, body: any): Promise<Response> {
    const options = {
      method: 'POST',
      uri,
      body,
      json: true
    };

    return request(options);
  }
}
