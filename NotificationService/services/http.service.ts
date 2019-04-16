import { Service } from 'typedi';

const request = require('request-promise-native');

export type Response = any;

@Service()
export class HttpService {
    public async Get(uri: string, headers?: any): Promise<Response> {
        return await request.get({ uri: uri, json: true, headers: headers });
    }

    public async Post(uri: string, body: any, headers?: any): Promise<Response> {
        return await request.post({ uri, body, json: true, headers: headers });
    }
}
