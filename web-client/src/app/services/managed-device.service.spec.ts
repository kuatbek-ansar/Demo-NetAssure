import { TestBed, inject } from '@angular/core/testing';

import { ManagedDeviceService } from './managed-device.service';
import { Injector } from '@angular/core';

describe('ManagedDeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Injector]
    });
  });

  it('should be created', inject([Injector], (service: ManagedDeviceService) => {
    expect(service).toBeTruthy();
  }));
});
