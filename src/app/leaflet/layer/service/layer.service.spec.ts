import { TestBed, inject } from '@angular/core/testing';

import { LayerService } from './layer.service';
import { MapService } from '../../map/service/map.service';

describe('LayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayerService, MapService]
    });
  });

  it('should be created', inject([LayerService], (service: LayerService) => {
    expect(service).toBeTruthy();
  }));
});
