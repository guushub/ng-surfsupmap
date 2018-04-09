import { TestBed, inject } from '@angular/core/testing';

import { SurfsupMapIconService } from './surfsup-map-icon.service';

describe('SurfsupMapIconService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurfsupMapIconService]
    });
  });

  it('should be created', inject([SurfsupMapIconService], (service: SurfsupMapIconService) => {
    expect(service).toBeTruthy();
  }));
});
