import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectService } from 'src/app/core/services/select.service';

import { QuizResultsComponent } from './quiz-results.component';

describe('QuizResultsComponent', () => {
  let component: QuizResultsComponent;
  let fixture: ComponentFixture<QuizResultsComponent>;
  let selectServiceStub: Partial<SelectService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizResultsComponent],
      providers: [{ provide: SelectService, useValue: selectServiceStub }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
