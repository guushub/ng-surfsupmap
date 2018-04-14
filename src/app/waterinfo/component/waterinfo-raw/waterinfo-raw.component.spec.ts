import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterinfoRawComponent } from './waterinfo-raw.component';
import { MapService } from '../../../leaflet/map/service/map.service';
import { WaterinfoService } from '../../service/waterinfo.service';
import { HttpClientModule } from '@angular/common/http';

describe('WaterinfoRawComponent', () => {
  let component: WaterinfoRawComponent;
  let fixture: ComponentFixture<WaterinfoRawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [MapService, WaterinfoService],
      declarations: [ WaterinfoRawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterinfoRawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
