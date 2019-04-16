import { TestBed, inject } from '@angular/core/testing';

import { IfaceService } from './iface.service';
import { Injector } from '@angular/core';

describe('HostInterfaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Injector]
    });
  });

  it('should be created', inject([Injector], (service: IfaceService) => {
    expect(service).toBeTruthy();
  }));
});
