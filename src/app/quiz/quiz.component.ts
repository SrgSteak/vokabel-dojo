import { Component, OnInit } from '@angular/core';
import { SyllablesService, flashcard } from '../syllables.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: [ './quiz.component.scss' ]
})
export class QuizComponent implements OnInit {
  showSubmenu = false;
  showCard: flashcard;
  answers: Array<flashcard>;
  questionMode: string;
  answerMode: string;
  numberAnswers = 3;
  displayError: boolean;
  display: number;
  misses: number;
  hits: number;

  hiragana: Array<flashcard>;

  constructor(public syllablesService: SyllablesService) {
    this.hiragana = syllablesService.getAll();
    this.questionMode = "hiragana";
    this.answerMode = "german";
    this.displayError = false;
    this.display = 0;
    this.layout();
  }

  ngOnInit() {
  }

  reset() {
    this.syllablesService.resetStatistic();
    this.displayError = false;
    this.layout();
  }

  setMode(question: string, answer: string) {
    this.questionMode = question;
    this.answerMode = answer;
  }

  layout() {
    this.syllablesService.shuffle(this.hiragana);
    this.showCard = this.hiragana[this.display];
    this.answers = this.getAnswersFor(this.showCard);
  }

  continue() {
    this.displayError = false;
  }

  answerSelect(question: flashcard, answer: flashcard) {
    if (question.hiragana == answer.hiragana) {
      this.syllablesService.totalHits++;
      this.displayError = false;
      this.layout();
    } else {
      this.syllablesService.totalMisses++;
      this.displayError = true;
    }
  }

  getAnswersFor(card: flashcard) {
    this.syllablesService.shuffle(this.hiragana);
    const draw = this.syllablesService.draw(
      this.hiragana.filter((value) => { return value[this.questionMode] !== card[this.questionMode]}),
      this.numberAnswers
    );
    draw.push(card);
    return this.syllablesService.shuffle<flashcard>(draw);
  }

  updateNumberAnswers(number: number) {
    this.numberAnswers = number;
    this.layout();
  }
}
