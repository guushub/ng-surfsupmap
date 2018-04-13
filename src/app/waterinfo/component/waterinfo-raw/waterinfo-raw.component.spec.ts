import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterinfoRawComponent } from './waterinfo-raw.component';

describe('WaterinfoRawComponent', () => {
  let component: WaterinfoRawComponent;
  let fixture: ComponentFixture<WaterinfoRawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
