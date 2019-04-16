import { TestBed, inject } from '@angular/core/testing';

import { HistoryService } from './history.service';
import { Injector } from '@angular/core';

describe('HistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Injector]
    });
  });

  it('should be created', inject([Injector], (service: HistoryService) => {
    expect(service).toBeTruthy();
  }));
});
