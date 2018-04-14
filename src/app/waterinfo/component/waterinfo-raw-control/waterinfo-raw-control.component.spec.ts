import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterinfoRawControlComponent } from './waterinfo-raw-control.component';
import { MapService } from '../../../leaflet/map/service/map.service';

describe('WaterinfoRawControlComponent', () => {
  let component: WaterinfoRawControlComponent;
  let fixture: ComponentFixture<WaterinfoRawControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterinfoRawControlComponent ],
      providers: [MapService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterinfoRawControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
