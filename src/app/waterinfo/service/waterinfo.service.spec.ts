import { TestBed, inject } from '@angular/core/testing';

import { WaterinfoService } from './waterinfo.service';

describe('WaterinfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WaterinfoService]
    });
  });

  it('should be created', inject([WaterinfoService], (service: WaterinfoService) => {
    expect(service).toBeTruthy();
  }));
});
