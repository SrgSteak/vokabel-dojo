import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { wordFlashcard } from 'src/app/interfaces/word-flashcard.interface';
import { VocabularyService } from 'src/app/vocabulary.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import FuzzySearch from 'fuzzy-search';
import { Card, CardService } from 'src/app/core/services/card.service';
import { Router } from '@angular/router';
import { User } from 'src/app/core/auth.service';
import { Deck } from 'src/app/core/services/deck.service';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit, OnDestroy {

  @Input() cards: Array<wordFlashcard>;
  @Input() user: User;
  @Input() deck: Deck;
  @Input() allowEdit = false;
  words: Array<wordFlashcard>;
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
          const card = e.payload.doc.data() as Card;
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

  reading(word: Card, mode: string) {
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

  show(card: Card) {
    if (this.allowEdit) {
      if (this.user) {
        this.router.navigate(['/', 'user', 'decks', this.deck.uid, 'cards', card.uid, 'edit']);
      } else {
        this.router.navigate(['/', 'cards', 'edit', card.uid]);
      }
    }
  }
}
