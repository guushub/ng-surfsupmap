import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterinfoLoadingComponent } from './waterinfo-loading.component';

describe('WaterinfoLoadingComponent', () => {
  let component: WaterinfoLoadingComponent;
  let fixture: ComponentFixture<WaterinfoLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterinfoLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterinfoLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
