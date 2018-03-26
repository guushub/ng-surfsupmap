import { TestBed, inject } from '@angular/core/testing';

import { LayerWaterinfoService } from './layer-waterinfo.service';

describe('LayerWaterinfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayerWaterinfoService]
    });
  });

  it('should be created', inject([LayerWaterinfoService], (service: LayerWaterinfoService) => {
    expect(service).toBeTruthy();
  }));
});
