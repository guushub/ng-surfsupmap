import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterinfoLayerComponent } from './waterinfo-layer.component';

describe('SurfsupMapLayerComponent', () => {
  let component: WaterinfoLayerComponent;
  let fixture: ComponentFixture<WaterinfoLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterinfoLayerComponent ]
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
