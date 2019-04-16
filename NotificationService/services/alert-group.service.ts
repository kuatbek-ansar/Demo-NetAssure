import { Inject, Service } from 'typedi';

import { AlertGroupApiData } from '../models';
import { AlertGroupViewModel } from '../view-models';
import { ApiService } from './api.service';
import { LogService } from './log.service';

@Service()
export class AlertGroupService {
    constructor(private apiService: ApiService, private logService: LogService) {
    }

    public async GetById(id: number): Promise<AlertGroupApiData> {
        const apiData = new AlertGroupApiData();

        try {
            apiData.AlertGroups = await this.apiService.Get(
                `alertGroups/${id}`
            ) as AlertGroupViewModel;
        } catch (error) {
            this.logService.Error('Getting Alert Group', { Id: id }, error);

            apiData.Error = error;
        }

        return apiData;
    }
}
