import { TestBed, inject } from '@angular/core/testing';

import { DeviceManagementHistoryService } from './managed-device-history.service';
import { Injector } from '@angular/core';

describe('ManagedDeviceHistoryServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Injector]
    });
  });

  it('should be created', inject([Injector], (service: DeviceManagementHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
