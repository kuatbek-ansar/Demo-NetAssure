import { TestBed, inject } from '@angular/core/testing';

import { CircuitService } from './circuit.service';
import { Injector } from '@angular/core';

describe('CircuitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Injector]
    });
  });

  it('should be created', inject([Injector], (service: CircuitService) => {
    expect(service).toBeTruthy();
  }));
});
