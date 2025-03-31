import { TestBed } from '@angular/core/testing';

import { CareerTestService } from './career-test.service';

describe('CareerTestService', () => {
  let service: CareerTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CareerTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
