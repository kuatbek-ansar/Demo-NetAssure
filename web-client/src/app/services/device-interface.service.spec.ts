import { TestBed, inject } from '@angular/core/testing';

import { DeviceInterfaceService } from './device-interface.service';
import { Injector } from '@angular/core';

describe('DeviceInterfaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Injector]
    });
  });

  it('should be created', inject([Injector], (service: DeviceInterfaceService) => {
    expect(service).toBeTruthy();
  }));
});
