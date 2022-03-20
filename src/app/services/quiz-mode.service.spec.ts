import { TestBed } from '@angular/core/testing';

import { QuizModeService } from './quiz-mode.service';

describe('QuizModeService', () => {
  let service: QuizModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
