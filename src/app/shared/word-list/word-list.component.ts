import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import FuzzySearch from 'fuzzy-search';
import { CardService } from 'src/app/core/services/card.service';
import { Router, RouterModule } from '@angular/router';
import { User } from 'src/app/core/auth.service';
import { Deck } from 'src/app/core/services/deck.service';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Card } from 'src/app/core/entities/card';
import { FontSwitcherService } from 'src/app/core/services/font-switcher.service';
import { CardType, WordType, AdjectiveType, VerbType } from 'src/app/core/entities/card-type';
import { APPEAR_ANIMATION } from 'src/app/core/animations/modal.animation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule],
  animations: [APPEAR_ANIMATION]
})
export class WordListComponent implements OnInit, OnDestroy, OnChanges {

  @Input() cards: Array<Card>;
  @Input() user: User;
  @Input() deck: Deck;
  @Input() allowEdit = false;
  @Output() selectedCard = new EventEmitter<CardInterface>();
  showSubmenu = false;
  modeSub: Subscription;
  searchFormSub: Subscription;
  private cardSub: Subscription;

  searchForm = new FormControl('');

  modeForm = new FormGroup({
    left: new FormControl('japanese'),
    right: new FormControl('german')
  });
  showGerman: boolean;
  showExamples: boolean;
  showReadings: boolean;

  get leftSide() {
    return this.modeForm.get('left').value;
  }
  get rightSide() {
    return this.modeForm.get('right').value;
  }

  get fontMode() {
    return this.fontSwitcherService.currentStyle;
  }

  get cardTypes() {
    return CardType;
  }

  get wordTypes() {
    return WordType;
  }

  get adjectiveTypes() {
    return AdjectiveType;
  }

  get verbTypes() {
    return VerbType;
  }

  constructor(
    private router: Router,
    private cardService: CardService,
    public fontSwitcherService: FontSwitcherService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      this.cdr.detectChanges();
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
  }

  ngOnInit() {
    if (!this.cards) {
      this.cardSub = this.cardService.allPublicCards().subscribe(data => {
        this.cards = data.map(e => {
          const card = Card.createFromCardInterface(e);
          return card;
        });
      })
    }
    this.modeSub = this.modeForm.valueChanges.subscribe(() => {
      this.updateFilter();
    });
    this.searchFormSub = this.searchForm.valueChanges.subscribe(() => {
      this.updateFilter();
    });
  }

  ngOnDestroy() {
    if (this.cardSub) {
      this.cardSub.unsubscribe();
    }
    if (this.modeSub) {
      this.modeSub.unsubscribe();
    }
    if (this.searchFormSub) {
      this.searchFormSub.unsubscribe();
    }
  }

  updateFilter() {
    if (this.searchForm.value) {
      const searcher = new FuzzySearch(this.cards, ['german', 'japanese', 'examples.german', 'examples.japanese', 'examples.reading', 'japanese_readings', 'chinese_readings'], {
        caseSensitive: false,
      });
      this.cards = searcher.search(this.searchForm.value);
    }
  }

  reading(word: CardInterface, mode: string) {
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

  readingWithPreference(preference: string, card: CardInterface) {
    switch (preference) {
      case 'japanese':
        if (card['japanese']) {
          return card['japanese'];
        }
        if (card['kanji']) {
          return card['kanji'];
        }
        if (card['hiragana']) {
          return card['hiragana'];
        }
        if (card['katakana']) {
          return card['katakana'];
        }
        break;
      case 'reading':
        if (card['japanese_readings']) {
          if (card['chinese_readings']) {
            return card['japanese_readings'].concat(card['chinese_readings'].join(', '));
          }
          return card['japanese_readings'].join(', ');
        }
        if (card['chinese_readings']) {
          return card['chinese_readings'].join(', ');
        }

        break;
      case 'german':
        if (card['german'][0] != '') {
          return card['german'][0];
        }
        return this.readingWithPreference('reading', card);
    }
  }

  show(card: CardInterface) {
    this.selectedCard.emit(card);
    this.router.navigate([{ outlets: { modal: ['cards', card.uid] } }])
  }
}
