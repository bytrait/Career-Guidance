import { TestBed } from '@angular/core/testing';

import { WorkStreamService } from './work-stream.service';

describe('WorkStreamService', () => {
  let service: WorkStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
