import { Service } from 'typedi';
import { DataRepository } from './data.repository';
import { ConnectionManager } from './connection-manager';
import { DeviceManagementHistory } from '../entity/device-management-history.entity';
import { ManagedDeviceCost } from '../../models';
import { LogService } from '../services';

@Service()
export class DeviceManagementHistoryRepository extends DataRepository<DeviceManagementHistory> {
  public constructor(public manager: ConnectionManager, private log: LogService) {
    super(manager, DeviceManagementHistory, log);
  }

  public async getBillableUnits(groupId: string, billDate: Date): Promise<Array<ManagedDeviceCost>> {
    return (await (await this.getOrm()).query(`
    select cast(md.host_id as char(50)) hostid  from (select host_id,
                          max(changeDate) changeDate
                     from device_management_history
                    where destinationManagedState = 1 group by host_id) dmh
    inner join managed_device md on dmh.host_id = md.host_id inner join
    (select host_id, sum(Days) Days from ( -- get total number of days on at all
     select host_id, TurnOn, min(Days) Days from ( -- find unique turn ons
       select distinct dmh.host_id,
            -- get the date and distct to fuzz cases where we turn on multiple times in a day (examples in our data 10347)
            date(dmh.changeDate) TurnOn,
            date(dmh2.changeDate) TurnOff,
            -- number of days with any activity at all. If not turn off then take the time now
            datediff(COALESCE(dmh2.changeDate,now()), dmh.changeDate) + 1 Days
         from device_management_history dmh left outer join
            device_management_history dmh2 on dmh.host_id = dmh2.host_id -- join against self to find when device is next turned off
          and dmh2.changeDate > dmh.changeDate inner join
            managed_device md on dmh.host_id = md.host_id
        where dmh.destinationManagedState=1 -- only caputure time from on (1) to off (0)
          and (dmh2.destinationManagedState=0 or dmh2.destinationManagedState is null)) i
     group by host_id, TurnOn) t
   group by host_id having sum(Days) >= 10) bd on bd.host_id = md.host_id
   where (dmh.changeDate > ? or md.isManaged=1) and md.group_id=?
    `, [billDate, groupId]));
  }
}
