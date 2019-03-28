import { Component, OnInit } from '@angular/core';
import { wordFlashcard } from 'src/app/interfaces/word-flashcard.interface';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { VocabularyService } from 'src/app/vocabulary.service';
import { syllableFlashcard } from 'src/app/interfaces/syllable-flashcard.interface';
import { SyllablesService } from 'src/app/syllables.service';

@Component({
  selector: 'app-word-grid',
  templateUrl: './word-grid.component.html',
  styleUrls: ['./word-grid.component.scss']
})
export class WordGridComponent implements OnInit {
  deck: Array<wordFlashcard>;
  syllables: Array<syllableFlashcard>;
  mode = 'hiragana';
  currentWord: wordFlashcard;
  buildWord: Map<number, syllableFlashcard>;
  currentGrid: Array<syllableFlashcard>;
  leftSide = 'german';
  rightSide = this.mode;
  showSubmenu = false;
  hiraganaFormSub: Subscription;
  katakanaFormSub: Subscription;

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

  constructor(private vocabularyService: VocabularyService, private syllablesService: SyllablesService) {
    this.setMode('hiragana');
    this.layout();
  }

  ngOnInit() {
    this.hiraganaFormSub = this.hiraganaFilterForm.valueChanges.subscribe(() => {
      this.updateFilter();
    });
    this.katakanaFormSub = this.katakanaFilterForm.valueChanges.subscribe(() => {
      this.updateFilter();
    });
  }

  layout() {
    this.buildWord = new Map<number, syllableFlashcard>();
    this.deck = this.vocabularyService.shuffle(this.deck);
    this.currentWord = this.deck[0];
    this.currentGrid = this.syllablesService.getCardsContaining(this.currentWord[this.mode], 24 - this.currentWord[this.mode].length);
  }

  ngOnDestroy() {
    if (this.hiraganaFormSub) {
      this.hiraganaFormSub.unsubscribe();
    }
    if (this.katakanaFormSub) {
      this.katakanaFormSub.unsubscribe();
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
      this.updateFilter();
    } else {
      this.updateFilter();
    }
  }

  selectedChar(index: number, target: HTMLElement) {
    // console.log(index);
    // console.log(this.currentGrid[index]);
    const answer = document.getElementsByClassName('answer')[0];
    // console.log(answer.getBoundingClientRect());
    if (this.buildWord.get(index)) {
      this.buildWord.delete(index);
      target.removeAttribute('style');
    } else {
      target.style.position = 'absolute';
      target.style.top = (answer.getBoundingClientRect().top) + 'px';
      target.style.left = ( answer.getBoundingClientRect().left + ((2 + target.getBoundingClientRect().width) * this.buildWord.size)) + 'px';
      console.log(120); console.log(answer.getBoundingClientRect().left); console.log(target.getBoundingClientRect().width);
      console.log(this.buildWord.size);
      console.log(target.style.left);
      this.buildWord.set(index, this.currentGrid[index]);
    }
    // console.log(this.buildWord);
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
        this.deck = this.vocabularyService.getHiraganaForRows(rows);
      } else {
        this.deck = this.vocabularyService.getAllHiragana();
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
        this.deck = this.vocabularyService.getKatakanaForRows(rows);
      } else {
        this.deck = this.vocabularyService.getAllKatakana();
      }
    }
  }
}
