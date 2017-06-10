import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPanelLeftComponent } from './map-panel-left.component';

describe('MapPanelLeftComponent', () => {
  let component: MapPanelLeftComponent;
  let fixture: ComponentFixture<MapPanelLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPanelLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPanelLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
