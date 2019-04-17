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
  buildWordString: string;
  currentGrid: Array<syllableFlashcard>;
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
    this.buildWordString = '';
    this.currentWord = this.deck[0];
    do {
      this.deck = this.vocabularyService.shuffle(this.deck);
    } while (this.currentWord[this.mode] == this.deck[0][this.mode]);
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
    this.updateFilter();
  }

  selectedChar(index: number, target: HTMLElement) {
    this.buildWordString = '';
    if (this.buildWord.get(index)) {
      this.buildWord.delete(index);
      target.removeAttribute('style');
      target.classList.remove('card-selected');
    } else {
      this.updateCardPosition(target);
      this.buildWord.set(index, this.currentGrid[index]);
    }

    this.buildWord.forEach((value, key) => {
      this.buildWordString += value[this.mode];
    });

    if (this.buildWordString == this.currentWord[this.mode]) {
      setTimeout(() => {
        const cls = document.getElementsByClassName('gridpart');
        for(var i = 0; i < cls.length; i++){
          cls[i].removeAttribute("style");
       }
        this.layout();
      }, 2000);
    }
  }

  updateCardPosition(target: HTMLElement, number?: number) {
    // get answer card box
    const answer = document.getElementsByClassName('answer')[0];
    // calculate offset of cards original position to answerbox (without transforms)

    var style = getComputedStyle(target),
        transform = style.transform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);
    if(mat) return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    const currentOffsetX = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
    const currentOffsetY = mat ? parseFloat(mat[1].split(', ')[5]) : 0;

    let verticalOffset = answer.getBoundingClientRect().top - target.getBoundingClientRect().top;
    let horizontalOffset = target.getBoundingClientRect().left - answer.getBoundingClientRect().left;

    verticalOffset = verticalOffset + currentOffsetY;
    horizontalOffset = horizontalOffset + currentOffsetX;
    // remove width of number of cards
    if (number) {
      horizontalOffset = horizontalOffset - ((2 + target.getBoundingClientRect().width) * number);
    } else {
      horizontalOffset = horizontalOffset - ((2 + target.getBoundingClientRect().width) * this.buildWord.size);
    }
    // decide if the card needs to move left or right
    horizontalOffset *= -1;
    // set transform. css transition animates it.
    target.classList.add('card-selected');
    target.style.transform = 'translate(' + horizontalOffset + 'px, ' + verticalOffset + 'px)';
  }

  updateCardPositions() {
    let gridparts = document.getElementsByClassName('gridpart');
    let index = 0;
    this.buildWord.forEach((value, key) => {
      let target = gridparts[key] as HTMLElement;
      this.updateCardPosition(target, index);
      index++;
    });
  }

  skipWord() {
    let cls = document.getElementsByClassName('gridpart');
    for(var i = 0; i < cls.length; i++){
      cls[i].removeAttribute("style");
    }
    let word = this.currentWord[this.mode].split('');
    let word_index = 0;
    while(word_index < word.length) {
      this.currentGrid.forEach((flashcard, key) => {
        if (flashcard[this.mode] == word[word_index]) {
          if (word_index < word.length) {
            word_index++;
            this.selectedChar(key, cls[key] as HTMLElement);
          }
        }
      });
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
    this.layout();
  }
}
