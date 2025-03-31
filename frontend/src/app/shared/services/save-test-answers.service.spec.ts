import { TestBed } from '@angular/core/testing';

import { SaveTestAnswersService } from './save-test-answers.service';

describe('SaveTestAnswersService', () => {
  let service: SaveTestAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveTestAnswersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
