import { TestBed, inject } from '@angular/core/testing';

import { SurfsupMapDataService } from './surfsup-map-data.service';

describe('SurfsupMapDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurfsupMapDataService]
    });
  });

  it('should be created', inject([SurfsupMapDataService], (service: SurfsupMapDataService) => {
    expect(service).toBeTruthy();
  }));
});
