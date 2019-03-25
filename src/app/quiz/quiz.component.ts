import { Component, OnInit } from '@angular/core';
import { SyllablesService, flashcard } from '../syllables.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: [ './quiz.component.scss' ]
})
export class QuizComponent implements OnInit {
  showCard: flashcard;
  answers: Array<flashcard>;
  questionMode: string;
  answerMode: string;
  displayError: boolean;
  display: number;
  misses: number;
  hits: number;

  hiragana: Array<flashcard>;

  constructor(public syllablesService: SyllablesService) {
    this.hiragana = syllablesService.getAll();
    this.questionMode = "hiragana";
    this.answerMode = "german";
    this.layout();
    this.displayError = false;
    this.display = 0;
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
    this.shuffle(this.hiragana);
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

  shuffle(cards: Array<flashcard>) {
    var currentIndex = cards.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = cards[currentIndex];
      cards[currentIndex] = cards[randomIndex];
      cards[randomIndex] = temporaryValue;
    }
    this.display = Math.floor(Math.random() * this.hiragana.length);
    return cards;
  }

  getAnswersFor(card: flashcard) {
    let idents;
    let cards;
    do {
      cards = this.randomCards(3);
      idents = cards.filter((checkMe) => { checkMe[this.questionMode] === card[this.questionMode]});
    } while (idents.length > 0);
    cards.push(card);

    return this.shuffle(cards);
  }

  randomCards(count: number) {
    var cards = [];
    for (var i = 0; i < count; i++) {
      cards.push(this.hiragana[i]);
    }
    return cards;
  }
}
