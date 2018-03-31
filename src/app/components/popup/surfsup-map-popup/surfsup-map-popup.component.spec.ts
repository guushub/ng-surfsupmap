import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurfsupMapPopupComponent } from './surfsup-map-popup.component';

describe('SurfsupMapPopupComponent', () => {
  let component: SurfsupMapPopupComponent;
  let fixture: ComponentFixture<SurfsupMapPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurfsupMapPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurfsupMapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
