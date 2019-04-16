import * as _ from 'lodash';
import { Matcher } from 'ts-mockito/lib/matcher/type/Matcher';

export class ArrayMatcher extends Matcher {
    private value: any;
    constructor(private expected) {
        super();
    }

    match(value: any): boolean {
        return _.isEqual(this.expected, value);
    }

    toString(): string {
        return `Did not match ${this.expected}`;
    }
}

export function arrayMatches(expected): any {
    return new ArrayMatcher(expected);
}
