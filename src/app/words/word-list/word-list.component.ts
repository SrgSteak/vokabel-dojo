import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import FuzzySearch from 'fuzzy-search';
import { CardService } from 'src/app/core/services/card.service';
import { Router } from '@angular/router';
import { User } from 'src/app/core/auth.service';
import { Deck } from 'src/app/core/services/deck.service';
import { CardInterface } from 'src/app/core/entities/card-interface';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit, OnDestroy {

  @Input() cards: Array<CardInterface>;
  @Input() user: User;
  @Input() deck: Deck;
  @Input() allowEdit = false;
  words: Array<CardInterface>;
  leftSide = 'german';
  rightSide = 'kanji';
  showSubmenu = false;
  modeSub: Subscription;
  searchFormSub: Subscription;

  searchForm = new FormControl('');

  modeForm = new FormGroup({
    left: new FormControl('german'),
    right: new FormControl('kanji')
  });

  constructor(private router: Router, private cardService: CardService) { }

  ngOnInit() {
    this.words = this.cards;
    if (!this.words) {
      this.cardService.loadAll().snapshotChanges().subscribe(data => {
        this.cards = data.map(e => {
          const card = e.payload.doc.data() as CardInterface;
          card.uid = e.payload.doc.id;
          return card;
        });
        this.words = this.cards;
      });
    }
    this.modeSub = this.modeForm.valueChanges.subscribe(() => {
      this.updateFilter();
    });
    this.searchFormSub = this.searchForm.valueChanges.subscribe(() => {
      this.updateFilter();
    });
  }

  ngOnDestroy() {
    if (this.modeSub) {
      this.modeSub.unsubscribe();
    }
    if (this.searchFormSub) {
      this.searchFormSub.unsubscribe();
    }
  }

  updateFilter() {
    this.leftSide = this.modeForm.get('left').value
    this.rightSide = this.modeForm.get('right').value
    if (this.searchForm.value) {
      const searcher = new FuzzySearch(this.cards, ['german', 'hiragana', 'katakana', 'romaji', 'kanji'], {
        caseSensitive: false,
      });
      this.words = searcher.search(this.searchForm.value);
    } else {
      this.words = this.cards;
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
        if (card['reading']) {
          return card['reading'];
        }
        if (card['japanese_readings']) {
          if (card['chinese_readings']) {
            return card['japanese_readings'].concat(card['chinese_readings'].join());
          }
          return card['japanese_readings'].join();
        }
        if (card['chinese_readings']) {
          return card['chinese_readings'].join();
        }

        break;
      case 'german':
        if (card['german']) {
          return card['german'];
        }
        break;
    }
  }

  show(card: CardInterface) {
    if (this.allowEdit) {
      if (this.user) {
        this.router.navigate(['/', 'user', 'decks', this.deck.uid, 'cards', card.uid, 'edit']);
      } else {
        this.router.navigate(['/', 'cards', 'edit', card.uid]);
      }
    }
  }
}
