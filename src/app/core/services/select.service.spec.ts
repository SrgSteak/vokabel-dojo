import { TestBed } from '@angular/core/testing';

import { SelectService } from './select.service';

xdescribe('SelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } }));

  it('should be created', () => {
    const service: SelectService = TestBed.get(SelectService);
    expect(service).toBeTruthy();
  });
});
