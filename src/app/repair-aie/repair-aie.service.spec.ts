import { TestBed, inject } from '@angular/core/testing';

import { RepairAieService } from './repair-aie.service';

describe('RepairAieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepairAieService]
    });
  });

  it('should be created', inject([RepairAieService], (service: RepairAieService) => {
    expect(service).toBeTruthy();
  }));
});
