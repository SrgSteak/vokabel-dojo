import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizOptionsComponent } from './quiz-options.component';

describe('QuizOptionsComponent', () => {
  let component: QuizOptionsComponent;
  let fixture: ComponentFixture<QuizOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
