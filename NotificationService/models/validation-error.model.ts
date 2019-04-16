import { ErrorType } from './error-type.enum';

export class ValidationError {
    Message: string;

    Type: ErrorType;

    constructor(message?: string, type?: ErrorType) {
        this.Message = (message != null) ? message : '';
        this.Type = (type != null) ? type : ErrorType.Unknown;
    }
}
