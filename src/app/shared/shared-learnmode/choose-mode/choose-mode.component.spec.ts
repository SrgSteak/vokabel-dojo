import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseModeComponent } from './choose-mode.component';

describe('ChooseModeComponent', () => {
  let component: ChooseModeComponent;
  let fixture: ComponentFixture<ChooseModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
