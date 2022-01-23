import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeckService } from 'src/app/core/services/deck.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { FontSwitcherService } from 'src/app/core/services/font-switcher.service';
import { WordType, CardType } from 'src/app/core/entities/card-type';

@Component({
  selector: 'app-word-quiz',
  templateUrl: './word-quiz.component.html',
  styleUrls: ['./word-quiz.component.scss']
})
export class WordQuizComponent implements OnInit {

  @Input() cards: Array<CardInterface>;
  showCard: CardInterface;
  answers: Array<CardInterface>;
  displayError = false;
  displayStatistic = false;
  showSubmenu = false;
  numberAnswers = 3;
  modeSub: Subscription;
  modeForm = new FormGroup({
    left: new FormControl('japanese'),
    right: new FormControl('german'),
    rubi: new FormControl('')
  });
  enableHiragana = false;
  enableKatakana = false;
  enableKanji = false;
  peekRubi = false;
  index = 0;
  deck: Array<CardInterface> = [];

  get questionMode() {
    return this.modeForm.get('left').value;
  }

  get answerMode() {
    return this.modeForm.get('right').value;
  }

  get rubi() {
    return this.modeForm.get('rubi').value;
  }


  constructor(
    public deckService: DeckService,
    public fontSwitcher: FontSwitcherService
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
    this.prepareDeck();
    this.nextCard(true);
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
    this.shuffle();
    this.nextCard(true);
  }

  answerSelect(question: CardInterface, answer: CardInterface) {
    if (question.uid == answer.uid) {
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

  private nextCard(startAtZero = false) {
    if (this.index === this.deck.length - 1 || startAtZero) {
      this.index = 0;
    } else {
      ++this.index;
    }
    this.showCard = this.deck[this.index];
    this.answers = this.deckService.draw(
      this.deckService.shuffle(this.deck.filter((value) => { return value.uid !== this.showCard.uid })),
      this.numberAnswers
    );
    this.answers.push(this.showCard);
    this.answers = this.deckService.shuffle(this.answers);
  }

  updateNumberAnswers(number: number) {
    this.numberAnswers = number;
  }

  shuffle() {
    this.deckService.shuffle(this.deck);
    this.nextCard(true);
  }
}

