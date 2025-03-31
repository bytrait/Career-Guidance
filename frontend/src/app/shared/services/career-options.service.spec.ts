import { TestBed } from '@angular/core/testing';

import { CareerOptionsService } from './career-options.service';

describe('CareerOptionsService', () => {
  let service: CareerOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CareerOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
