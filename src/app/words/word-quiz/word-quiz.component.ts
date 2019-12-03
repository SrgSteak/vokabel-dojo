import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeckService } from 'src/app/core/services/deck.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { FontSwitcherService } from 'src/app/core/services/font-switcher.service';

@Component({
  selector: 'app-word-quiz',
  templateUrl: './word-quiz.component.html',
  styleUrls: ['./word-quiz.component.scss']
})
export class WordQuizComponent implements OnInit {

  @Input() deck: Array<CardInterface>;
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

  get questionMode() {
    return this.modeForm.get('left').value;
  }

  get answerMode() {
    return this.modeForm.get('right').value;
  }

  get rubi() {
    return this.modeForm.get('rubi').value;
  }


  constructor(private route: ActivatedRoute, public deckService: DeckService, public fontSwitcher: FontSwitcherService) {
  }

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
    this.layout();
  }

  toggleStatistic() {
    this.displayStatistic = !this.displayStatistic;
  }

  reset() {
    this.displayError = false;
    this.layout();
  }

  layout() {
    this.showCard = this.deck[0];
    do {
      this.deckService.shuffle(this.deck);
    } while (this.showCard.uid == this.deckService.draw(this.deck, 1)[0].uid && this.deck.length > 1);
    this.showCard = this.deckService.draw(this.deck, 1)[0];
    this.answers = this.deckService.draw(
      this.deck.filter((value) => { return value.uid !== this.showCard.uid }),
      this.numberAnswers
    );
    this.answers.push(this.showCard);
    this.answers = this.deckService.shuffle(this.answers);
  }

  answerSelect(question: CardInterface, answer: CardInterface) {
    if (question.uid == answer.uid) {
      this.deckService.totalHits++;
      if (!this.displayError) {
        question.hits++;
      }
      this.displayError = false;
      this.layout();
    } else {
      if (!this.displayError) {
        question.misses++;
        this.deckService.totalMisses++;
        this.displayError = true;
      }
    }
  }

  updateNumberAnswers(number: number) {
    this.numberAnswers = number;
    this.layout();
  }
}

