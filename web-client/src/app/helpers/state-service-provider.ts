import { Observable } from 'rxjs/Observable';

export class StateServiceProvider {
    public default() {
        return {
            User: {
                Account: { GroupId: 17 }
            },
            Loading$: Observable.from([]),
            AccountStateChanged$: Observable.from([]),
            Working: () => { },
            Ready: () => { }
        };
    }
}
