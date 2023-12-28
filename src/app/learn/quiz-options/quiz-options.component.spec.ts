import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizOptionsComponent } from './quiz-options.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('QuizOptionsComponent', () => {
  let component: QuizOptionsComponent;
  let fixture: ComponentFixture<QuizOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizOptionsComponent ],
      imports: [ReactiveFormsModule]
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
