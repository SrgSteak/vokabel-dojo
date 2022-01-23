import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordLearnComponent } from './word-learn.component';

describe('WordLearnComponent', () => {
  let component: WordLearnComponent;
  let fixture: ComponentFixture<WordLearnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [WordLearnComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
