import { TestBed, inject } from '@angular/core/testing';

import { GraphService } from './graph.service';
import { Injector } from '@angular/core';

describe('GraphService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Injector]
    });
  });

  it('should be created', inject([Injector], (service: GraphService) => {
    expect(service).toBeTruthy();
  }));
});
