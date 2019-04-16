import { ApiPayload } from './api-payload.model';

export class ApiSuccessPayload extends ApiPayload {
    constructor(body: any) {
        super(200, body);
    }
}
