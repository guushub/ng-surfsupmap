import { TestBed, inject } from '@angular/core/testing';

import { MapMainService } from './map-main.service';

describe('MapMainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapMainService]
    });
  });

  it('should be created', inject([MapMainService], (service: MapMainService) => {
    expect(service).toBeTruthy();
  }));
});
