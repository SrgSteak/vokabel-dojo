import { Component, OnInit } from '@angular/core';
import { VocabularyService } from '../../vocabulary.service';
import { wordFlashcard } from '../../interfaces/word-flashcard.interface';
import { flashcard } from '../../interfaces/flashcard.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-word-quiz',
  templateUrl: './word-quiz.component.html',
  styleUrls: ['./word-quiz.component.css']
})
export class WordQuizComponent implements OnInit {

  showCard: wordFlashcard;
  answers: Array<wordFlashcard>;
  misses: number;
  hits: number;
  deck: Array<wordFlashcard>;
  questionMode: string;
  answerMode: string;
  displayError = false;
  displayStatistic: boolean;
  deckMode: string;
  numberAnswers = 3;
  showSubmenu = false;

  constructor(public vocabularyService: VocabularyService, private route: ActivatedRoute) {
    if (route.snapshot.params.type === 'hiragana') {
      this.deck = vocabularyService.getAllHiragana();
      this.questionMode = 'hiragana';
      this.answerMode = 'german'
      this.deckMode = 'hiragana';
    } else {
      this.questionMode = 'katakana';
      this.answerMode = 'german'
      this.deckMode = 'katakana';
      this.deck = vocabularyService.getAllKatakana();
    }

    this.route.params.subscribe(params => {
      if (params.type === 'hiragana') {
        this.questionMode = 'hiragana';
        this.answerMode = 'german';
        this.deckMode = 'hiragana';
        this.deck = vocabularyService.getAllHiragana();
        this.layout();
      } else {
        this.questionMode = 'katakana';
        this.answerMode = 'german';
        this.deckMode = 'katakana';
        this.deck = vocabularyService.getAllKatakana();
        this.layout();
      }
    });

    this.answerMode = 'german';
    this.displayError = false;
    this.displayStatistic = false;
    this.hits = 0;
    this.misses = 0;
  }

  ngOnInit() {
    this.layout();
  }

  toggleStatistic() {
    this.displayStatistic = !this.displayStatistic;
  }

  reset() {
    this.vocabularyService.resetStatistic();
    this.displayError = false;
    this.layout();
  }

  layout() {
    this.vocabularyService.shuffle(this.deck);
    this.showCard = this.vocabularyService.draw(this.deck, 1)[0];
    this.answers = this.vocabularyService.draw(
      this.deck.filter((value) => { return value[this.questionMode] !== this.showCard[this.questionMode]}),
      this.numberAnswers
    );
    this.answers.push(this.showCard);
    this.answers = this.vocabularyService.shuffle(this.answers);
  }

  answerSelect(question: wordFlashcard, answer: wordFlashcard) {
    if (question[this.answerMode] == answer[this.answerMode]) {
      this.vocabularyService.totalHits++;
      if (!this.displayError) {
        question.hits++;
      }
      this.displayError = false;
      this.layout();
    } else {
      console.log('not correct');
      if (!this.displayError) {
        question.misses++;
        this.vocabularyService.totalMisses++;
        this.displayError = true;
      }
    }
  }

  setMode(question: string, answer: string) {
    this.questionMode = question;
    this.answerMode = answer;
  }

  updateNumberAnswers(number: number) {
    this.numberAnswers = number;
    this.layout();
  }
}

