import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FontSwitcherComponent } from './font-switcher.component';

describe('FontSwitcherComponent', () => {
  let component: FontSwitcherComponent;
  let fixture: ComponentFixture<FontSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FontSwitcherComponent ]
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
