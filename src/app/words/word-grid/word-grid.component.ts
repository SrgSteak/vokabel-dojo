import { Component, OnInit, Input } from '@angular/core';
import { SyllablesService } from 'src/app/syllables.service';
import { DeckService } from 'src/app/core/services/deck.service';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Card } from 'src/app/core/entities/card';

@Component({
  selector: 'app-word-grid',
  templateUrl: './word-grid.component.html',
  styleUrls: ['./word-grid.component.scss']
})
export class WordGridComponent implements OnInit {
  @Input() deck: Array<Card>;
  syllables: Array<CardInterface>;
  mode = 'japanese';
  currentWord: Card;
  buildWord: Map<number, CardInterface>;
  buildWordString: string;
  currentGrid: Array<CardInterface>;
  showSubmenu = false;
  show = 0;
  characterSet: Array<string> = [];
  currentQuestion: string;
  currentAnswer: string;

  constructor(private syllablesService: SyllablesService) {
  }

  ngOnInit() {
    this.characterSet = this.syllablesService.createCharactersetFromCard(this.deck);
    this.setMode('japanese');
    this.layout();
  }

  layout() {
    this.buildWord = new Map<number, Card>();
    this.buildWordString = '';
    this.currentWord = this.deck[this.show];
    this.currentQuestion = this.currentWord.getReading();
    // TODO: check currentWord against mode. If not available, skip.
    this.currentAnswer = this.currentWord.japanese;
    let sizeGrid = 24;
    if (sizeGrid > this.characterSet.length) {
      sizeGrid = this.characterSet.length;
    }
    this.currentGrid = this.syllablesService.getCardsContaining(this.currentAnswer, sizeGrid - this.currentAnswer.length, this.characterSet);
    // console.log('currentQuestion: ' + this.currentQuestion);
    // console.log('currentAnswer: ' + this.currentAnswer);
    // console.log(this.characterSet);
    // console.log(this.currentGrid);
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
      this.buildWordString += value;
    });
    console.log('searching for: ' + this.currentAnswer);
    console.log('typed: ' + this.buildWordString);
    if (this.buildWordString == this.currentAnswer) {
      setTimeout(() => {
        const cls = document.getElementsByClassName('gridpart');
        for (var i = 0; i < cls.length; i++) {
          cls[i].removeAttribute("style");
        }
        if (this.show >= this.deck.length - 1) {
          this.show = 0;
        } else {
          this.show++;
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
    return "";
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
