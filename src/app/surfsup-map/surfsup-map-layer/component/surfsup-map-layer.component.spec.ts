import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurfsupMapLayerComponent } from './surfsup-map-layer.component';

describe('SurfsupMapLayerComponent', () => {
  let component: SurfsupMapLayerComponent;
  let fixture: ComponentFixture<SurfsupMapLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurfsupMapLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurfsupMapLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
