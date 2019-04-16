import { Notification } from './notification.model';

describe('Notification Model', () => {
  beforeEach(() => {
  });

  describe('Display name', () => {

    it('should render the friendly name instead of host name if it exists', () => {
      const friendlyName = 'FriendlyNamesRUs';
      const hostName = 'HostName';
      const sut = new Notification({
        hosts : [ { name: friendlyName, host: hostName } ]
      });

      expect(sut.hostName).toBe(friendlyName);

    });

    it('should render the host name if no friendly name exists', () => {
      const hostName = 'HostName';
      const sut = new Notification({
        hosts : [ { host: hostName } ]
      });

      expect(sut.hostName).toBe(hostName);

    });

  });

});
