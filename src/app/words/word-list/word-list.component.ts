import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import FuzzySearch from 'fuzzy-search';
import { CardService } from 'src/app/core/services/card.service';
import { Router } from '@angular/router';
import { User } from 'src/app/core/auth.service';
import { Deck } from 'src/app/core/services/deck.service';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Card } from 'src/app/core/entities/card';
import { FontSwitcherService } from 'src/app/core/services/font-switcher.service';
import { CardType, WordType, AdjectiveType, VerbType } from 'src/app/core/entities/card-type';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit, OnDestroy {

  @Input() cards: Array<Card>;
  @Input() user: User;
  @Input() deck: Deck;
  @Input() allowEdit = false;
  @Output() selectedCard = new EventEmitter<CardInterface>();
  words: Array<Card>;
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

  constructor(private router: Router, private cardService: CardService, public fontSwitcherService: FontSwitcherService) { }

  ngOnInit() {
    this.words = this.cards;
    if (!this.words) {
      this.cardSub = this.cardService.allPublicCards().subscribe(data => {
        this.cards = data.map(e => {
          const card = Card.createFromCardInterface(e);
          return card;
        });
        this.words = this.cards;
        this.updateTable();
      })
    } else {
      this.updateTable();
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
      this.words = searcher.search(this.searchForm.value);
    } else {
      this.words = this.cards;
    }
    this.updateTable();
  }

  updateTable() {
    this.showGerman = this.containsGerman();
    this.showExamples = this.containsExamples();
    this.showReadings = this.containsReadings();
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

  containsReadings() {
    let asdf = false;
    this.words.forEach(card => {
      if (card.hasReadings()) {
        asdf = true;
      }
    });
    return asdf;
  }

  containsGerman() {
    let asdf = false;
    this.words.forEach(card => {
      if (card.hasGerman()) {
        asdf = true;
      }
    });
    return asdf;
  }

  containsExamples() {
    let asdf = false
    this.words.forEach(card => {
      if (card.hasExamples()) {
        asdf = true;
      }
    });
    return asdf;
  }

  show(card: CardInterface) {
    this.selectedCard.emit(card);
    this.router.navigate([{ outlets: { modal: ['card', card.uid] } }])
  }
}
