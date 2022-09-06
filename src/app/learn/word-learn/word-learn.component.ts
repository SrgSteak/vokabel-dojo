import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { DeckService } from 'src/app/core/services/deck.service';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Card } from 'src/app/core/entities/card';
import { FontSwitcherService } from 'src/app/core/services/font-switcher.service';
import { SelectService } from 'src/app/core/services/select.service';
import { ActivatedRoute } from '@angular/router';
import { CardService } from 'src/app/core/services/card.service';
import { AuthService } from 'src/app/core/auth.service';
import { MenuService } from 'src/app/shared/menu/menu.service';

@Component({
  selector: 'app-word-learn',
  templateUrl: './word-learn.component.html',
  styleUrls: ['./word-learn.component.scss']
})
export class WordLearnComponent implements OnInit, OnDestroy {

  cards: Array<Card>;
  show = 0;
  clicked = false;
  showSubmenu = false;
  formSub: Subscription;
  form = new FormGroup({
    question: new FormControl('japanese'),     // display Questions
    answer: new FormControl('german'),      // display answers
    displayMode: new FormControl('click'),  // behaviour for next() function
    rubi: new FormControl('')               // display ruby characters or not
  });
  cardSub: Subscription;
  protected source: String;

  get question() {
    return this.form.get('question').value;
  }
  get answer() {
    return this.form.get('answer').value;
  }
  get displayMode() {
    return this.form.get('displayMode').value;
  }
  get rubi() {
    return this.form.get('rubi').value;
  }
  get fontMode() {
    return this.fontSwitcherService.currentStyle;
  }

  get card() {
    return this.cards[this.show];
  }

  constructor(
    private router: ActivatedRoute,
    private selectService: SelectService,
    private deckService: DeckService,
    private cardService: CardService,
    private authService: AuthService,
    protected menuService: MenuService,
    private fontSwitcherService: FontSwitcherService
  ) { }

  ngOnInit() {
    this.router.paramMap.subscribe(params => {
      this.source = params.get('uid');
      if (this.source === 'selection') {
        this.cards = this.selectService.cards;
        this.cardSub = this.selectService.loadedSelection.subscribe(cards => {
          this.cards = cards;
        });
      } else {
        this.authService.user.subscribe(user => {
          this.cardSub = this.cardService.loadForDeckUid(params.get('uid'), user ? ['', user.uid] : ['']).subscribe(data => {
            this.cards = data;
          })
        })
      }
    });
  }

  ngOnDestroy() {
    this.cardSub?.unsubscribe();
  }

  shuffle() {
    this.cards = this.deckService.shuffle(this.cards);
    this.show = 0;
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

  goToNext() {
    this.show++;
    if (this.show >= this.cards.length) {
      this.show = 0;
    }
  }

  goToPrevious() {
    if (this.show === 0) {
      this.show = this.cards.length - 1;
    } else {
      this.show--;
    }
  }

  displayModeForCard(card: CardInterface, mode: string): string {
    // kanji, rubi active, card has reading
    if (mode === 'kanji' && card.japanese && this.rubi && card.reading) {
      return 'kanji_with_rubi';

      // kanji, rubi active, no reading but jap readings
    } else if (mode === 'kanji' && card.japanese && this.rubi && (card.japanese_readings.length || card.chinese_readings.length)) {
      if (card.japanese_readings.length || card.chinese_readings.length) {
        return 'kanji_with_rubi_readings';
      }
      return 'kanji_with_rubi_from_jap_readings';
    }

    if (mode === 'german' && !card.german.length) {
      return 'kanji_readings_only';
    }
    if (mode === 'reading') {
      if (!card.reading) {
        return 'kanji_readings_only';
      }
    }

    return 'word';
  }

  displayWithFallback(word: CardInterface, mode: string) {
    if (word[mode]) {
      return word[mode];
    }
    if (word['kanji']) {
      return word['kanji'];
    }
    if (word['hiragana']) {
      return word['hiragana'];
    }
    if (word['katakana']) {
      return word['katakana'];
    }
    if (word['romaji']) {
      return word['romaji'];
    }
  }
}
