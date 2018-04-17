import { TestBed, inject } from '@angular/core/testing';

import { RegionControlService } from './region-control.service';

describe('RegionControlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegionControlService]
    });
  });

  it('should be created', inject([RegionControlService], (service: RegionControlService) => {
    expect(service).toBeTruthy();
  }));
});
