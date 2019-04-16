import { Notification } from '../../../models';

export class NotificationViewModel extends Notification {
  public lastChangeDateStamp: number;

  public constructor() {
    super();
  }
}
