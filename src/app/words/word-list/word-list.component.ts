import { Component, OnInit, OnDestroy } from '@angular/core';
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

  words: Array<wordFlashcard>;
  mode = 'hiragana';
  leftSide = 'german';
  rightSide = this.mode;
  showSubmenu = false;
  hiraganaFormSub: Subscription;
  katakanaFormSub: Subscription;
  searchFormSub: Subscription;

  searchForm = new FormControl('');

  hiraganaFilterForm = new FormGroup({
    row_a: new FormControl(''),
    row_k: new FormControl(''),
    row_s: new FormControl(''),
    row_t: new FormControl(''),
    row_na: new FormControl(''),
    row_h: new FormControl(''),
    row_m: new FormControl(''),
    row_y: new FormControl(''),
    row_r: new FormControl(''),
    row_w: new FormControl(''),
    row_n: new FormControl(''),
    row_combinations: new FormControl(''),
    row_tsu: new FormControl(''),
  });

  katakanaFilterForm = new FormGroup({
    row_a: new FormControl(''),
    row_t: new FormControl(''),
    row_na: new FormControl(''),
    row_m: new FormControl(''),
    row_y: new FormControl(''),
    row_aieo: new FormControl(''),
  });

  constructor(private vocabularyService: VocabularyService) {
    this.setMode('hiragana');
  }

  ngOnInit() {
    this.hiraganaFormSub = this.hiraganaFilterForm.valueChanges.subscribe(() => {
      this.updateFilter();
    });
    this.katakanaFormSub = this.katakanaFilterForm.valueChanges.subscribe(() => {
      this.updateFilter();
    });
    this.searchFormSub = this.searchForm.valueChanges.subscribe(() => {
      this.updateFilter();
    });
  }

  ngOnDestroy() {
    if (this.hiraganaFormSub) {
      this.hiraganaFormSub.unsubscribe();
    }
    if (this.katakanaFormSub) {
      this.katakanaFormSub.unsubscribe();
    }
    if (this.searchFormSub) {
      this.searchFormSub.unsubscribe();
    }
  }

  setMode(mode: string) {
    this.mode = mode;
    if (this.leftSide != 'german') {
      this.leftSide = mode;
    } else {
      this.rightSide = mode;
    }
    if (this.mode == 'hiragana') {
      // this.words = this.vocabularyService.getAllHiragana();
      this.updateFilter();
    } else {
      // this.words = this.vocabularyService.getAllKatakana();
      this.updateFilter();
    }
  }

  updateFilter() {
    const rows = [];
    if (this.mode == 'hiragana') {
      if (this.hiraganaFilterForm.get('row_a').value) {
        rows.push('a');
      }
      if (this.hiraganaFilterForm.get('row_k').value) {
        rows.push('ka');
      }
      if (this.hiraganaFilterForm.get('row_s').value) {
        rows.push('sa');
      }
      if (this.hiraganaFilterForm.get('row_t').value) {
        rows.push('ta');
      }
      if (this.hiraganaFilterForm.get('row_na').value) {
        rows.push('na');
      }
      if (this.hiraganaFilterForm.get('row_h').value) {
        rows.push('ha');
      }
      if (this.hiraganaFilterForm.get('row_m').value) {
        rows.push('ma');
      }
      if (this.hiraganaFilterForm.get('row_y').value) {
        rows.push('ya');
      }
      if (this.hiraganaFilterForm.get('row_r').value) {
        rows.push('ra');
      }
      if (this.hiraganaFilterForm.get('row_w').value) {
        rows.push('wa');
      }
      if (this.hiraganaFilterForm.get('row_n').value) {
        rows.push('n');
      }
      if (this.hiraganaFilterForm.get('row_combinations').value) {
        rows.push('combinations');
      }
      if (this.hiraganaFilterForm.get('row_tsu').value) {
        rows.push('tsu');
      }

      if (rows.length > 0) {
        this.words = this.vocabularyService.getHiraganaForRows(rows);
      } else {
        this.words = this.vocabularyService.getAllHiragana();
      }
    } else {
      if (this.katakanaFilterForm.get('row_a').value) {
        rows.push('a');
      }
      if (this.katakanaFilterForm.get('row_t').value) {
        rows.push('ta');
      }
      if (this.katakanaFilterForm.get('row_na').value) {
        rows.push('na');
      }
      if (this.katakanaFilterForm.get('row_m').value) {
        rows.push('ma');
      }
      if (this.katakanaFilterForm.get('row_y').value) {
        rows.push('ya');
      }
      if (this.katakanaFilterForm.get('row_aieo').value) {
        rows.push('aieo');
      }

      if (rows.length > 0) {
        this.words = this.vocabularyService.getKatakanaForRows(rows);
      } else {
        this.words = this.vocabularyService.getAllKatakana();
      }
    }
    if (this.searchForm.value) {
      const searcher = new FuzzySearch(this.words, ['german', 'hiragana', 'katakana'], {
        caseSensitive: false,
      });
      this.words = searcher.search(this.searchForm.value);
    }
  }
}
