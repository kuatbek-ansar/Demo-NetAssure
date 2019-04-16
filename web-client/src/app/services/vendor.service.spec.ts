import { TestBed, inject } from '@angular/core/testing';

import { VendorService } from './vendor.service';
import { StateService } from './index';
import { Injector } from '@angular/core';

describe('VendorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Injector, StateService]
    });
  });

  it('should be created', inject([Injector, StateService], (service: VendorService) => {
    expect(service).toBeTruthy();
  }));
});
