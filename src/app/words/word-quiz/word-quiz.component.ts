import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeckService } from 'src/app/core/services/deck.service';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { FontSwitcherService } from 'src/app/core/services/font-switcher.service';
import { WordType } from 'src/app/core/entities/card-type';
import { QuizModeService } from 'src/app/services/quiz-mode.service';

@Component({
  selector: 'app-word-quiz',
  templateUrl: './word-quiz.component.html',
  styleUrls: ['./word-quiz.component.scss']
})
export class WordQuizComponent implements OnInit {

  @Input() cards: Array<CardInterface>;
  @Output() close = new EventEmitter();
  showCard: CardInterface;
  answers: Array<CardInterface>;
  displayError = false;
  displayStatistic = false;
  showSubmenu = false;
  displaySettings = false;
  displayEndscreen = false;
  numberAnswers = 3;

  enableHiragana = false;
  enableKatakana = false;
  enableKanji = false;
  peekRubi = false;
  index = 0;
  round = 1;
  deck: Array<CardInterface> = [];

  get questionMode() {
    return this.quizModeService.modeForm.get('left').value;
  }

  get answerMode() {
    return this.quizModeService.modeForm.get('right').value;
  }

  get rubi() {
    return this.quizModeService.modeForm.get('rubi').value;
  }


  constructor(
    public deckService: DeckService,
    public fontSwitcher: FontSwitcherService,
    public quizModeService: QuizModeService
  ) { }

  get scoredWords() {
    return this.deck.sort((a, b) => {
      if (a.hits - a.misses > b.hits - b.misses) {
        return -1
      }
      if (a.hits - a.misses < b.hits - b.misses) {
        return 1
      }
      return 0;
    });
  }

  ngOnInit() {
    this.showSettings();
  }

  showSettings() {
    this.displaySettings = true;
  }

  start() {
    this.displaySettings = false;
    this.displayEndscreen = false;
    this.prepareDeck();
    this.nextCard(true);
  }

  end() {
    this.displaySettings = false;
    this.displayEndscreen = true;
  }

  leave() {
    this.close.emit();
  }

  prepareDeck() {
    this.deck = [];
    this.cards.forEach(card => {
      switch (card.wordType) {
        case WordType.kanji:
          card.examples.forEach(example => {
            this.deck.push({
              japanese: example.japanese,
              reading: example.reading,
              german: [example.german],
              hits: 0,
              misses: 0,
              uid: card.uid
            });
          });
          break;
        default:
          this.deck.push(card);
          break;
      }
    });
  }

  toggleStatistic() {
    this.displayStatistic = !this.displayStatistic;
  }

  reset() {
    this.displayError = false;
    this.deck.forEach(card => {
      card.hits = 0;
      card.misses = 0;
    });
    this.deckService.totalHits = 0;
    this.deckService.totalMisses = 0;

    this.shuffle();
    this.nextCard(true);
  }

  answerSelect(question: CardInterface, answer: CardInterface) {
    if (question.uid == answer.uid) { // TODO: sometimes answers can be the same strings - that should count as valid hit as well!
      this.deckService.totalHits++;
      if (!this.displayError) {
        question.hits++;
      }
      this.displayError = false;
      this.nextCard();
    } else {
      if (!this.displayError) {
        question.misses++;
        this.deckService.totalMisses++;
        this.displayError = true;
      }
    }
  }

  newRound() {
    this.round++;
    this.start();
  }

  nextCard(startAtZero = false) {
    ++this.index;
    if (startAtZero) {
      this.index = 0;
    }
    if (this.index >= this.deck.length) {
      this.end();
    } else {
      this.showCard = this.deck[this.index];
      this.answers = this.deckService.draw(
        this.deckService.shuffle(this.deck.filter((value) => { return value.uid !== this.showCard.uid })),
        this.numberAnswers
      );
      this.answers.push(this.showCard);
      this.answers = this.deckService.shuffle(this.answers);
    }
  }

  updateNumberAnswers(number: number) {
    this.numberAnswers = number;
  }

  shuffle() {
    this.deckService.shuffle(this.deck);
    this.nextCard(true);
  }
}

