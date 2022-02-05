import { TestBed } from '@angular/core/testing';

import { FontSwitcherService } from './font-switcher.service';

xdescribe('FontSwitcherService', () => {
  beforeEach(() => TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } }));

  it('should be created', () => {
    const service: FontSwitcherService = TestBed.get(FontSwitcherService);
    expect(service).toBeTruthy();
  });
});
