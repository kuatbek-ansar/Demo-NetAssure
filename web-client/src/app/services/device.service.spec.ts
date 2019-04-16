import { TestBed, inject } from '@angular/core/testing';

import { DeviceService } from './device.service';
import { StateService } from './index';
import { Injector } from '@angular/core';

describe('DeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceService, StateService, Injector]
    });
  });

  it('should be created', inject([Injector], (service: Injector) => {
    expect(service).toBeTruthy();
  }));
});
