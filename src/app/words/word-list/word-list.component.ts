import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { wordFlashcard } from 'src/app/interfaces/word-flashcard.interface';
import { VocabularyService } from 'src/app/vocabulary.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import FuzzySearch from 'fuzzy-search';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.css']
})
export class WordListComponent implements OnInit, OnDestroy {

  @Input() cards: Array<wordFlashcard>;
  words: Array<wordFlashcard>;
  leftSide = 'german';
  rightSide = 'hiragana';
  showSubmenu = false;
  modeSub: Subscription;
  searchFormSub: Subscription;

  searchForm = new FormControl('');

  modeForm = new FormGroup({
    left: new FormControl('german'),
    right: new FormControl('hiragana')
  });

  constructor() { }

  ngOnInit() {
    this.words = this.cards;
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
}
