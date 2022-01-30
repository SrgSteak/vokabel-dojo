import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';

xdescribe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard],
      teardown: { destroyAfterEach: false }
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
