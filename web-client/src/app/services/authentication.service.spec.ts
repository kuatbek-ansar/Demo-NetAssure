import { TestBed, inject } from '@angular/core/testing';

import { AuthenticationService, StateService } from './';
import { Injector } from '@angular/core';

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Injector, StateService],
    });
  });

  it('should be created', inject([Injector, StateService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
