import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRegionComponent } from './map-region.component';
import { MapComponent } from '../../leaflet/map/component/map/map.component';
import { MapService } from '../../leaflet/map/service/map.service';

describe('MapRegionComponent', () => {
  let component: MapRegionComponent;
  let fixture: ComponentFixture<MapRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRegionComponent, MapComponent ],
      providers: [MapService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
