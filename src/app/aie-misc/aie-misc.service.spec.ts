import { TestBed, inject } from '@angular/core/testing';

import { AieMiscService } from './aie-misc.service';

describe('AieMiscService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AieMiscService]
    });
  });

  it('should be created', inject([AieMiscService], (service: AieMiscService) => {
    expect(service).toBeTruthy();
  }));
});
