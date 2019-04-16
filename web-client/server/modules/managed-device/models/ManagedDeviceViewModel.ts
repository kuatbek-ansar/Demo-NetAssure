import { ManagedDevice } from '../../../entity/index';

export class ManagedDeviceViewModel {
    id: number;
    name: string;
    host_id: number;
    group_id: number;
    isManaged: boolean;
}
