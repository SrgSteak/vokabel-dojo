import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectbubbleComponent } from './selectbubble.component';

xdescribe('SelectbubbleComponent', () => {
  let component: SelectbubbleComponent;
  let fixture: ComponentFixture<SelectbubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectbubbleComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectbubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
