import { TestBed } from '@angular/core/testing';

import { FontSwitcherService } from './font-switcher.service';

describe('FontSwitcherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FontSwitcherService = TestBed.get(FontSwitcherService);
    expect(service).toBeTruthy();
  });
});
