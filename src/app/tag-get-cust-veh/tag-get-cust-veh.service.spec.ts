import { TestBed, inject } from '@angular/core/testing';

import { TagGetCustVehService } from './tag-get-cust-veh.service';

describe('TagGetCustVehService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagGetCustVehService]
    });
  });

  it('should be created', inject([TagGetCustVehService], (service: TagGetCustVehService) => {
    expect(service).toBeTruthy();
  }));
});
