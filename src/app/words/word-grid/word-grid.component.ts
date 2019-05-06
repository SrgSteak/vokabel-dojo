import { Component, OnInit, Input } from '@angular/core';
import { wordFlashcard } from 'src/app/interfaces/word-flashcard.interface';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { VocabularyService } from 'src/app/vocabulary.service';
import { syllableFlashcard } from 'src/app/interfaces/syllable-flashcard.interface';
import { SyllablesService } from 'src/app/syllables.service';
import { DeckService } from 'src/app/core/services/deck.service';

@Component({
  selector: 'app-word-grid',
  templateUrl: './word-grid.component.html',
  styleUrls: ['./word-grid.component.scss']
})
export class WordGridComponent implements OnInit {
  @Input() deck: Array<wordFlashcard>;
  syllables: Array<syllableFlashcard>;
  mode = 'hiragana';
  currentWord: wordFlashcard;
  buildWord: Map<number, syllableFlashcard>;
  buildWordString: string;
  currentGrid: Array<syllableFlashcard>;
  showSubmenu = false;

  constructor(private vocabularyService: DeckService, private syllablesService: SyllablesService) {
  }

  ngOnInit() {
    this.setMode('hiragana');
    this.layout();
  }

  layout() {
    this.buildWord = new Map<number, syllableFlashcard>();
    this.buildWordString = '';
    this.currentWord = this.deck[0];
    do {
      this.deck = this.vocabularyService.shuffle(this.deck);
    } while (this.currentWord[this.mode] == this.deck[0][this.mode] && this.deck.length > 1);
    this.currentWord = this.deck[0];
    this.currentGrid = this.syllablesService.getCardsContaining(this.currentWord[this.mode], 24 - this.currentWord[this.mode].length);
  }

  ngOnDestroy() {
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
        for (var i = 0; i < cls.length; i++) {
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
    if (mat) return parseFloat(mat[1].split(', ')[13]);
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
    for (var i = 0; i < cls.length; i++) {
      cls[i].removeAttribute("style");
    }
    let word = this.currentWord[this.mode].split('');
    let word_index = 0;
    while (word_index < word.length) {
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
    this.layout();
  }
}
