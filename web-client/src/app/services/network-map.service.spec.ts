import { TestBed, inject } from '@angular/core/testing';

import { NetworkMapService } from './network-map.service';
import { Injector } from '@angular/core';

describe('ManagedDeviceHistoryServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Injector]
    });
  });

  it('should be created', inject([Injector], (service: NetworkMapService) => {
    expect(service).toBeTruthy();
  }));
});
