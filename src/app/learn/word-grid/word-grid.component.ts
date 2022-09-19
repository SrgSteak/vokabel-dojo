import { Component, OnInit, Input } from '@angular/core';
import { SyllablesService } from 'src/app/syllables.service';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Card } from 'src/app/core/entities/card';
import { FontSwitcherService } from 'src/app/core/services/font-switcher.service';
import { MenuService } from 'src/app/shared/menu/menu.service';
import { ActivatedRoute } from '@angular/router';
import { SelectService } from 'src/app/core/services/select.service';
import { CardService } from 'src/app/core/services/card.service';
import { AuthService } from 'src/app/core/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-word-grid',
  templateUrl: './word-grid.component.html',
  styleUrls: ['./word-grid.component.scss']
})
export class WordGridComponent implements OnInit {
  deck: Array<Card>;
  preparedDeck: Array<{ question: string, hints: Array<string>, answer: string }> = [];
  syllables: Array<CardInterface>;
  currentWord: { question: string, hints: Array<string>, answer: string };
  buildWord: Map<number, string>;
  buildWordString: string;
  currentGrid: Array<string>;
  show = 0;
  characterSet: Array<string> = [];
  showSubmenu = false;
  protected source: String;
  private cardSub: Subscription;
  private paramSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private syllablesService: SyllablesService,
    public fontSwitcherService: FontSwitcherService,
    protected selectService: SelectService,
    protected menuService: MenuService,
    protected cardService: CardService,
    protected authService: AuthService
  ) { }

  ngOnInit() {

    this.paramSub = this.route.paramMap.subscribe(params => {
      this.source = params.get('uid');
      if (this.source === 'selection') {
        this.deck = this.selectService.cards;
        this.prepareDeck();
        this.layout();
      } else {
        this.authService.user.subscribe(user => {
          this.cardSub = this.cardService.loadForDeckUid(params.get('uid'), user ? ['', user.uid] : ['']).subscribe(data => {
            this.deck = data;
            this.prepareDeck();
            this.layout();
          })
        })
      }
    });
  }

  /**
   * takes the deck of cards and creates words according to word type
   */
  private prepareDeck() {
    this.deck.forEach(_card => {
      if (!_card.isKanji()) {
        this.preparedDeck.push({ question: _card.getGerman(), hints: [_card.getReading()], answer: _card.japanese });
      }
      _card.examples.forEach(_example => {
        this.preparedDeck.push({ question: _example.german, hints: [_example.reading], answer: _example.japanese });
      });
    });
    this.characterSet = this.syllablesService.createCharsetFromFlashCards(this.preparedDeck, 'answer');
    this.preparedDeck = this.syllablesService.shuffle(this.preparedDeck);
  }

  layout() {
    this.buildWord = new Map<number, string>();
    this.buildWordString = '';
    this.currentWord = this.preparedDeck[this.show];
    let sizeGrid = 24;
    if (sizeGrid > this.characterSet.length) {
      sizeGrid = this.characterSet.length;
    }
    this.currentGrid = this.syllablesService.getCardsContaining(this.currentWord.answer, sizeGrid - this.currentWord.answer.length, this.characterSet);
  }

  ngOnDestroy() {
    this.paramSub?.unsubscribe();
    this.cardSub?.unsubscribe();
  }

  selectedChar(index: number, target: EventTarget) {
    this.buildWordString = '';
    if (this.buildWord.get(index)) {
      this.buildWord.delete(index);
      (target as HTMLElement).removeAttribute('style');
      (target as HTMLElement).classList.remove('card-selected');
    } else {
      this.updateCardPosition(target as HTMLElement);
      this.buildWord.set(index, this.currentGrid[index]);
    }

    this.buildWord.forEach((value, key) => {
      this.buildWordString += value;
    });
    if (this.buildWordString == this.currentWord.answer) {
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
    let cls = document.getElementsByClassName('gridpart');
    for (var i = 0; i < cls.length; i++) {
      cls[i].removeAttribute("style");
    }
    let word = this.currentWord.answer.split('');
    let word_index = 0;
    while (word_index < word.length) {
      this.currentGrid.forEach((flashcard, key) => {
        if (flashcard == word[word_index]) {
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
