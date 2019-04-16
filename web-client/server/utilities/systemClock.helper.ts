import { Service } from 'typedi/decorators/Service';

@Service()
export class SystemClock {
    public GetNow(): Date {
        return new Date();
    }
}
