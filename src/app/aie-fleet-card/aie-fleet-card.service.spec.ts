import { TestBed, inject } from '@angular/core/testing';

import { AieFleetCardService } from './aie-fleet-card.service';

describe('AieFleetCardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AieFleetCardService]
    });
  });

  it('should be created', inject([AieFleetCardService], (service: AieFleetCardService) => {
    expect(service).toBeTruthy();
  }));
});
