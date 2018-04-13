import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterinfoLayerComponent } from './waterinfo-layer.component';
import { WaterinfoService } from '../../service/waterinfo.service';
import { HttpClientModule } from '@angular/common/http';
import { SurfsupMapLayerService } from '../../../surfsup-map/surfsup-map-layer/service/surfsup-map-layer.service';
import { PopupService } from '../../../leaflet/popup/service/popup.service';
import { LayerService } from '../../../leaflet/layer/service/layer.service';
import { MapService } from '../../../leaflet/map/service/map.service';
import { SurfsupMapIconService } from '../../../surfsup-map/surfsup-map-icon/service/surfsup-map-icon.service';

describe('WaterinfoLayerComponent', () => {
  let component: WaterinfoLayerComponent;
  let fixture: ComponentFixture<WaterinfoLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [WaterinfoService, SurfsupMapLayerService, PopupService, LayerService, MapService, SurfsupMapIconService],
      declarations: [ WaterinfoLayerComponent ],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterinfoLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
