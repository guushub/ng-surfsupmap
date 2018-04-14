import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRegionComponent } from './data-region.component';
import { WaterinfoRawComponent } from '../../waterinfo/component/waterinfo-raw/waterinfo-raw.component';
import { WaterinfoService } from '../../waterinfo/service/waterinfo.service';
import { MapService } from '../../leaflet/map/service/map.service';
import { HttpClientModule } from '@angular/common/http';

describe('DataRegionComponent', () => {
  let component: DataRegionComponent;
  let fixture: ComponentFixture<DataRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ DataRegionComponent, WaterinfoRawComponent],
      providers: [MapService, WaterinfoService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
