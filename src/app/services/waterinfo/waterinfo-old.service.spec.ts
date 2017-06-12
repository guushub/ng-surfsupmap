import { TestBed, inject } from '@angular/core/testing';

import { WaterinfoOldService } from './waterinfo-old.service';

describe('WaterinfoOldService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WaterinfoOldService]
    });
  });

  it('should be created', inject([WaterinfoOldService], (service: WaterinfoOldService) => {
    expect(service).toBeTruthy();
  }));
});
