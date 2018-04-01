import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurfsupMapLayerAddComponent } from './surfsup-map-layer-add.component';

describe('SurfsupMapLayerAddComponent', () => {
  let component: SurfsupMapLayerAddComponent;
  let fixture: ComponentFixture<SurfsupMapLayerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurfsupMapLayerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurfsupMapLayerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
