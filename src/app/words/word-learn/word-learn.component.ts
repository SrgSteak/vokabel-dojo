import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Card } from 'src/app/core/services/card.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { DeckService } from 'src/app/core/services/deck.service';

@Component({
  selector: 'app-word-learn',
  templateUrl: './word-learn.component.html',
  styleUrls: ['./word-learn.component.scss']
})
export class WordLearnComponent implements OnInit, OnDestroy {

  @Input() _cards: Array<Card>;
  cards: Array<Card>;
  show = 0;
  clicked = false;
  showSubmenu = false;
  formSub: Subscription;
  form = new FormGroup({
    question: new FormControl('kanji'),     // display Questions
    answer: new FormControl('german'),      // display answers
    displayMode: new FormControl('click'),  // behaviour for next() function
    fontMode: new FormControl('serif'),     // setting for font of cards. serif or sans-serif.
    rubi: new FormControl('')               // display ruby characters or not
  });

  get question() {
    return this.form.get('question').value;
  }
  get answer() {
    return this.form.get('answer').value;
  }
  get displayMode() {
    return this.form.get('displayMode').value;
  }
  get fontMode() {
    return this.form.get('fontMode').value;
  }

  constructor(private deckService: DeckService) { }

  ngOnInit() {
    this.cards = this._cards;
  }

  ngOnDestroy() {

  }

  shuffle() {
    this.cards = this.deckService.shuffle(this.cards);
  }

  next() {
    if (this.displayMode !== 'always' && this.clicked === false) {
      this.clicked = true;
    } else {
      this.show++;
      if (this.show >= this.cards.length) {
        this.show = 0;
      }
      if (this.displayMode == 'click') {
        this.clicked = false;
      }
      if (this.displayMode == 'automatic') {
        this.clicked = false;
        setTimeout(() => {
          this.clicked = true;
        }, 2000);
      }
    }
  }
}
