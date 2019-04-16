import { ApiPayload } from './api-payload.model';

export class ApiFailurePayload extends ApiPayload {
    constructor(body: any) {
        super(400, body);
    }
}
