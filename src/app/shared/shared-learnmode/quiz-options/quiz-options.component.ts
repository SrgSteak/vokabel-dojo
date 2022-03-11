import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { QuizModeService } from 'src/app/services/quiz-mode.service';

@Component({
  selector: 'app-quiz-options',
  templateUrl: './quiz-options.component.html',
  styleUrls: ['./quiz-options.component.scss']
})
export class QuizOptionsComponent implements OnInit {

  @Output() public cancelled = new EventEmitter();
  @Output() public started = new EventEmitter();

  constructor(public quizModeService: QuizModeService) { }

  ngOnInit(): void {
  }

  start() {
    this.started.emit();
  }

  cancel() {
    this.cancelled.emit();
  }

}
