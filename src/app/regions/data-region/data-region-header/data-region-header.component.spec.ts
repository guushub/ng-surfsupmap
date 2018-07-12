import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRegionHeaderComponent } from './data-region-header.component';
import { MapService } from '../../../leaflet/map/service/map.service';
import { RegionControlService } from '../../region-control.service';

describe('DataRegionHeaderComponent', () => {
  let component: DataRegionHeaderComponent;
  let fixture: ComponentFixture<DataRegionHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRegionHeaderComponent ],
      providers: [MapService, RegionControlService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRegionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
