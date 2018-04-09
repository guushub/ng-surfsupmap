import { TestBed, inject } from '@angular/core/testing';

import { SurfsupMapLayerService } from './surfsup-map-layer.service';

describe('LayerWaterinfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurfsupMapLayerService]
    });
  });

  it('should be created', inject([SurfsupMapLayerService], (service: SurfsupMapLayerService) => {
    expect(service).toBeTruthy();
  }));
});
