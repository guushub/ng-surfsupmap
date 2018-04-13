import { TestBed, inject } from '@angular/core/testing';

import { WaterinfoService } from './waterinfo.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('WaterinfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [WaterinfoService, HttpClient]
    });
  });

  it('should be created', inject([WaterinfoService], (service: WaterinfoService) => {
    expect(service).toBeTruthy();
  }));
});
