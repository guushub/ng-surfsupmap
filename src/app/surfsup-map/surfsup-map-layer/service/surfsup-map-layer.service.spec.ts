import { TestBed, inject } from '@angular/core/testing';

import { SurfsupMapLayerService } from './surfsup-map-layer.service';
import { PopupService } from '../../../leaflet/popup/service/popup.service';
import { LayerService } from '../../../leaflet/layer/service/layer.service';
import { MapService } from '../../../leaflet/map/service/map.service';
import { SurfsupMapIconService } from '../../surfsup-map-icon/service/surfsup-map-icon.service';


describe('SurfsupMapLayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurfsupMapLayerService, PopupService, LayerService, MapService, SurfsupMapIconService]
    });
  });

  it('should be created', inject([SurfsupMapLayerService], (service: SurfsupMapLayerService) => {
    expect(service).toBeTruthy();
  }));
});
