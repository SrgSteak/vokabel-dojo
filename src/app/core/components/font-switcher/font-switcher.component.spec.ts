import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FontSwitcherComponent } from './font-switcher.component';

xdescribe('FontSwitcherComponent', () => {
  let component: FontSwitcherComponent;
  let fixture: ComponentFixture<FontSwitcherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FontSwitcherComponent],
      teardown: { destroyAfterEach: false }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FontSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
