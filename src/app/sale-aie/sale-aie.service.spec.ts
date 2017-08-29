/**
 * sale-aie.service.spec.ts
 */
import { TestBed, inject } from '@angular/core/testing';

import { SaleAieService } from './sale-aie.service';

describe('SaleAieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaleAieService]
    });
  });

  it('should be created', inject([SaleAieService], (service: SaleAieService) => {
    expect(service).toBeTruthy();
  }));
});
