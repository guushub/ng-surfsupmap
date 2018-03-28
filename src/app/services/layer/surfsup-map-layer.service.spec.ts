import { TestBed, inject } from '@angular/core/testing';

import { SurfsupLayerMapService } from './surfsup-map-layer.service';

describe('LayerWaterinfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurfsupLayerMapService]
    });
  });

  it('should be created', inject([SurfsupLayerMapService], (service: SurfsupLayerMapService) => {
    expect(service).toBeTruthy();
  }));
});
