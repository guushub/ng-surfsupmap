import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { MapService } from './leaflet/map/service/map.service';
import { MapComponent } from './leaflet/map/component/map/map.component';
import { WaterinfoRawComponent } from './waterinfo/component/waterinfo-raw/waterinfo-raw.component';
import { WaterinfoService } from './waterinfo/service/waterinfo.service';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [
        AppComponent, MapComponent,WaterinfoRawComponent
      ],
      providers: [MapService, WaterinfoService]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  // it(`should have as title 'app'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app');
  // }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!!');
  // }));
});
