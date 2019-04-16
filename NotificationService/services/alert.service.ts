import { Service } from 'typedi';

import { AlertApiData, NotificationSeverity } from '../models';
import { AlertDeviceViewModel } from '../view-models';
import { ApiService } from './api.service';
import { LogService } from './log.service';

@Service()
export class AlertService {
    constructor(private apiService: ApiService,
                private logService: LogService) {
    }

    public async GetByItemId(itemId: number, severity: NotificationSeverity): Promise<AlertApiData> {
        let deviceId: number;
        const apiData = new AlertApiData();

        try {
            deviceId = await this.GetHostByItemId(itemId);

            apiData.Alerts = await this.apiService.Get(
                `alerts/byDeviceId/${deviceId}/${severity}`
            ) as AlertDeviceViewModel[];
        } catch (error) {
            apiData.Error = error;

            this.logService.Error('Getting Alerts for Device', {
                ItemId: itemId,
                DeviceId: deviceId,
                Severity: severity
            }, error);

            throw error;
        }

        return apiData;
    }

    public async GetHostByItemId(itemId: number): Promise<number> {
        try {
            return await this.apiService.Get(
                `host/getByItemId/${itemId}`
            );
        } catch (error) {
            this.logService.Error('Getting Host for Item', {
                ItemId: itemId
            }, error);

            throw error;
        }
    }
}
